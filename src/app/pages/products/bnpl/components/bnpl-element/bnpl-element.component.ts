import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  CustomerInfo,
  PaydayLoanHmg,
  PaydayLoanTng,
} from '../../../../../../../open-api-modules/dashboard-api-docs';
import { MultiLanguageService } from '../../../../../share/translate/multiLanguageService';
import { BnplListService } from '../../bnpl-list/bnpl-list.service';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import {
  BUTTON_TYPE,
  RESPONSE_CODE,
} from '../../../../../core/common/enum/operator';
import { ApiResponseString } from '../../../../../../../open-api-modules/bnpl-api-docs';
import { NotificationService } from '../../../../../core/services/notification.service';

@Component({
  selector: 'app-bnpl-element',
  templateUrl: './bnpl-element.component.html',
  styleUrls: ['./bnpl-element.component.scss'],
})
export class BnplElementComponent implements OnInit {
  @Input() loanDetail: any;
  @Input() userInfo: CustomerInfo;
  @Output() loanDetailTriggerUpdateStatus = new EventEmitter<any>();
  subManager = new Subscription();
  constructor(
    private multiLanguageService: MultiLanguageService,
    private bnplListService: BnplListService,
    private notifier: ToastrService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {}

  public triggerUpdateLoanInfo(params) {
    let requestBody = {};
    if (params.note) {
      requestBody['note'] = params.note;
    }
    this.subManager.add(
      this.bnplListService
        .updateBnplApplication(this.loanDetail?.id, requestBody)
        .subscribe((response) => {
          if (!response || response.responseCode !== RESPONSE_CODE.SUCCESS) {
            return this.notifier.error(
              JSON.stringify(response?.message),
              response?.errorCode
            );
          }
        })
    );
  }

  public changeStatusBnplApplication({ id, status }) {
    const confirmDeleteRef = this.notificationService.openPrompt({
      imgUrl: 'assets/img/payday-loan/warning-prompt-icon.png',
      title: this.multiLanguageService.instant('common.are_you_sure'),
      content: this.multiLanguageService.instant(
        'bnpl.loan_info.prompt_reject'
      ),
      primaryBtnText: this.multiLanguageService.instant('common.confirm'),
      primaryBtnClass: 'btn-accent',
      secondaryBtnText: this.multiLanguageService.instant('common.skip'),
    });
    confirmDeleteRef.afterClosed().subscribe((result) => {
      if (result === BUTTON_TYPE.PRIMARY) {
        this.subManager.add(
          this.bnplListService
            .changeStatusBnplApplication(id, { status: status })
            .subscribe((result) => {
              if (!result || result.responseCode !== RESPONSE_CODE.SUCCESS) {
                return this.notifier.error(
                  JSON.stringify(result?.message),
                  result?.errorCode
                );
              }
              if (result.responseCode === 200) {
                // setTimeout(() => {
                //   this.notifier.success(
                //     this.multiLanguageService.instant(
                //       'merchant.merchant_detail.delete_merchant.toast'
                //     )
                //   );
                // }, 3000);
              }
            })
        );
      }
    });
  }

  public repaymentBnplApplication({ id, transactionAmount }) {
    const confirmDeleteRef = this.notificationService.openPrompt({
      imgUrl: 'assets/img/payday-loan/warning-prompt-icon.png',
      title: this.multiLanguageService.instant('common.are_you_sure'),
      content: this.multiLanguageService.instant(
        'bnpl.loan_info.prompt_repayment_period'
      ),
      primaryBtnText: this.multiLanguageService.instant('common.confirm'),
      primaryBtnClass: 'btn-accent',
      secondaryBtnText: this.multiLanguageService.instant('common.skip'),
    });
    confirmDeleteRef.afterClosed().subscribe((result) => {
      if (result === BUTTON_TYPE.PRIMARY) {
        this.subManager.add(
          this.bnplListService.repaymentBnplApplication(id, {
            transactionAmount: transactionAmount,
          })
            .subscribe((result) => {
              if (!result || result.responseCode !== RESPONSE_CODE.SUCCESS) {
                return this.notifier.error(
                  JSON.stringify(result?.message),
                  result?.errorCode
                );
              }
              if (result.responseCode === 200) {
                // setTimeout(() => {
                //   this.notifier.success(
                //     this.multiLanguageService.instant(
                //       'merchant.merchant_detail.delete_merchant.toast'
                //     )
                //   );
                // }, 3000);
              }
            })
        );
      }
    });
  }

}
