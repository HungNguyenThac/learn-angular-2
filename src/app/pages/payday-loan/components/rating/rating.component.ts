import { PlPromptComponent } from './../../../../share/components/dialogs/pl-prompt/pl-prompt.component';
import { UpdateRatingRequest } from './../../../../../../open-api-modules/customer-api-docs/model/updateRatingRequest';
import { RatingControllerService } from './../../../../../../open-api-modules/customer-api-docs/api/ratingController.service';
import {
  ERROR_CODE_KEY,
  RATING_STATUS,
} from './../../../../core/common/enum/payday-loan';
import { MultiLanguageService } from './../../../../share/translate/multiLanguageService';
import { NotificationService } from './../../../../core/services/notification.service';
import { Subscription, Observable } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import * as fromStore from 'src/app/core/store/index';
import { ApiResponseString } from 'open-api-modules/customer-api-docs';

@Component({
  selector: 'app-rating',
  templateUrl: './rating.component.html',
  styleUrls: ['./rating.component.scss'],
})
export class RatingComponent implements OnInit {
  subManager = new Subscription();
  customerId: string;
  public customerId$: Observable<any>;

  customerOpinion: string;
  rate: string;
  rateElementArray = [];
  rateArray = [];
  fastOpinionsArray = [
    'Giải ngân nhanh chóng',
    'Quy trình đơn giản',
    'Nhân viên tư vấn nhiệt tình',
    'Mức phí hợp lý',
  ];
  fastOpinionsHightlightStatus: Array<boolean> = [];

  constructor(
    private notificationService: NotificationService,
    private multiLanguageService: MultiLanguageService,
    private ratingControllerService: RatingControllerService,
    private store: Store<fromStore.State>,
    public dialogRef: MatDialogRef<RatingComponent>,
    public dialog: MatDialog
  ) {
    this.customerId$ = this.store.select(fromStore.getCustomerIdState);
    this.subManager.add(
      this.customerId$.subscribe((id) => {
        this.customerId = id;
      })
    );
  }

  ngOnInit(): void {
    for (const key in RATING_STATUS) {
      this.rateElementArray.push(document.getElementById(RATING_STATUS[key]));
      this.rateArray.push(RATING_STATUS[key]);
    }
  }
  onSubmit(accept: boolean) {
    if (accept) {
    }
    let customerOpinion: string = this.customerOpinion;
    for (let i = 0; i < this.fastOpinionsArray.length; i++) {
      if (this.fastOpinionsHightlightStatus[i]) {
        customerOpinion = this.fastOpinionsArray[i] + customerOpinion;
      }
    }

    const updateRatingRequest: UpdateRatingRequest = {
      customerId: this.customerId,
      customerOpinion: customerOpinion,
      rate: this.rate,
    };
    console.log('updateRatingRequest', updateRatingRequest);

    this.subManager.add(
      this.ratingControllerService
        .updateRating(updateRatingRequest)
        .subscribe((response: ApiResponseString) => {
          if (!response || response.responseCode !== 200) {
            return this.handleResponseError(response?.errorCode);
          }
          this.dialogRef.close();
          this.openSuccessDialog()
        })
    );
    
  }

  openSuccessDialog() {
    this.dialog.open(PlPromptComponent, {
      panelClass: 'custom-dialog-container',
      height: 'auto',
      minHeight: '194px',
      maxWidth: '330px',
      data: {
        imgBackgroundClass: 'text-center',
        imgUrl: 'assets/img/payday-loan/success-prompt-icon.png',
        title: 'Đã gửi phản hồi',
        content:
          'Mọi ý kiến, đóng góp của bạn đều có ý nghĩa cho việc hoàn thiện và phát triển hệ sinh thái Monex. Chân thành cám ơn và mong bạn tiếp tục ủng hộ Monex nhé!',
        primaryBtnText: this.multiLanguageService.instant('common.confirm'),
      },
    });
  }

  handleResponseError(errorCode: string) {
    return this.showError(
      'common.error',
      errorCode ? ERROR_CODE_KEY[errorCode] : 'common.something_went_wrong'
    );
  }

  showError(title: string, content: string) {
    return this.notificationService.openErrorModal({
      title: this.multiLanguageService.instant(title),
      content: this.multiLanguageService.instant(content),
      primaryBtnText: this.multiLanguageService.instant('common.confirm'),
    });
  }

  rateChoice(rate) {
    this.rate = RATING_STATUS[rate];
    for (let i = 0; i < this.rateArray.length; i++) {
      this.rateElementArray[i].classList.remove('choose');
      if (this.rateArray[i] === rate) {
        this.rateElementArray[i].classList.add('choose');
      }
    }
  }
}
