import { Rating } from './../../../../../../open-api-modules/customer-api-docs/model/rating';
import { PlPromptComponent } from './../../../../share/components/dialogs/pl-prompt/pl-prompt.component';
import { UpdateRatingRequest } from './../../../../../../open-api-modules/customer-api-docs/model/updateRatingRequest';
import { RatingControllerService } from './../../../../../../open-api-modules/customer-api-docs/api/ratingController.service';
import { ERROR_CODE_KEY } from './../../../../core/common/enum/payday-loan';
import { MultiLanguageService } from './../../../../share/translate/multiLanguageService';
import { NotificationService } from './../../../../core/services/notification.service';
import { Subscription, Observable } from 'rxjs';
import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import * as fromStore from 'src/app/core/store/index';
import {
  ApiResponseString,
  CreateRatingRequest,
} from 'open-api-modules/customer-api-docs';

@Component({
  selector: 'app-rating',
  templateUrl: './rating.component.html',
  styleUrls: ['./rating.component.scss'],
})
export class RatingComponent implements OnInit {
  subManager = new Subscription();
  customerId: string;
  public customerId$: Observable<any>;

  rateInfo: Rating;
  customerOpinion: string = '';
  rate: UpdateRatingRequest.RateEnum;
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
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data,
  ) {
    this.customerId$ = this.store.select(fromStore.getCustomerIdState);
    this.subManager.add(
      this.customerId$.subscribe((id) => {
        this.customerId = id;
      })
    );
    this.rateInfo = data
  }

  ngOnInit(): void {}
  onSubmit() {
    let updateRatingRequest: UpdateRatingRequest;

    //Rating
    let customerOpinion: string;
    customerOpinion = this.customerOpinion;
    for (let i = 0; i < this.fastOpinionsArray.length; i++) {
      if (this.fastOpinionsHightlightStatus[i]) {
        customerOpinion = this.fastOpinionsArray[i] + '.' + customerOpinion;
      }
    }

    updateRatingRequest = {
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
          this.openSuccessDialog();
        })
    );
  }

  onCloseRating() {
    let updateRatingRequest: UpdateRatingRequest;
    updateRatingRequest = {
      customerId: this.customerId,
    };
    this.subManager.add(
      this.ratingControllerService
        .updateRating(updateRatingRequest)
        .subscribe((response: ApiResponseString) => {
          if (!response || response.responseCode !== 200) {
            return this.showError(
              'common.error',
              'common.something_went_wrong'
            );
          }
          this.dialogRef.close();
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

  rateChoice(rate: UpdateRatingRequest.RateEnum) {
    this.rate = rate;
  }
}
