import { Component, OnInit } from '@angular/core';
import * as fromStore from './../../../../core/store';
import * as fromActions from './../../../../core/store';
import { MultiLanguageService } from '../../../../share/translate/multiLanguageService';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import * as fromSelectors from '../../../../core/store/selectors';

@Component({
  selector: 'ekyc',
  templateUrl: './ekyc.component.html',
  styleUrls: ['./ekyc.component.scss'],
})
export class EkycComponent implements OnInit {
  customerInfo: any;
  customerId: string;
  customerId$: Observable<string>;

  constructor(
    private multiLanguageService: MultiLanguageService,
    private store: Store<fromStore.State>
  ) {
    this.customerId$ = store.select(fromSelectors.getCustomerIdState);

    this.customerId$.subscribe((customerId) => {
      this.customerId = customerId;
    });
  }

  ngOnInit(): void {}

  async redirectToConfirmInformationPage() {
    // if (
    //   this.currentCustomerStatus &&
    //   PAYDAY_LOAN_UI_STATUS_ORDER_NUMBER[this.currentCustomerStatus] <
    //   PAYDAY_LOAN_UI_STATUS_ORDER_NUMBER.NOT_COMPLETE_FILL_EKYC_YET
    // ) {
    //   this.setCustomerStatus(
    //     PAYDAY_LOAN_UI_STATUS.NOT_COMPLETE_FILL_EKYC_YET
    //   );
    // }
    // await this.$router.push({ name: "PlConfirmInformation" });
  }

  async completeEkyc(ekycCompleteData) {
    if (!ekycCompleteData || !ekycCompleteData.idCardInfo) {
      this.notificationEkycError();
      return;
    }

    let ekycInfo = ekycCompleteData.idCardInfo;
    this.store.dispatch(new fromActions.SetEkycInfo(ekycInfo));

    await this.getVirtualAccount(this.customerId, ekycInfo.name);

    // if (
    //   this.currentCustomerStatus &&
    //   PAYDAY_LOAN_UI_STATUS_ORDER_NUMBER[this.currentCustomerStatus] <
    //     PAYDAY_LOAN_UI_STATUS_ORDER_NUMBER.NOT_COMPLETE_FILL_EKYC_YET
    // ) {
    //   await this.setCustomerStatus(
    //     PAYDAY_LOAN_UI_STATUS.NOT_COMPLETE_FILL_EKYC_YET
    //   );
    // }

    this.notificationEkycSuccess();
  }

  notificationEkycError() {
    this.store.dispatch(
      new fromActions.ShowErrorModal({
        title: this.multiLanguageService.instant('common.notification'),
        content: this.multiLanguageService.instant(
          'common.something_went_wrong'
        ),
        primaryBtnText: this.multiLanguageService.instant('common.confirm'),
      })
    );
  }

  notificationEkycSuccess() {
    this.store.dispatch(
      new fromActions.ShowErrorModal({
        title: this.multiLanguageService.instant(
          'payday_loan.ekyc.eKYC_successful'
        ),
        content: this.multiLanguageService.instant(
          'payday_loan.ekyc.eKYC_successful_content'
        ),
        primaryBtnText: this.multiLanguageService.instant('common.confirm'),
      })
    );
  }

  async createVirtualAccount(customerId, accountName) {
    // return await PaymentService.createVA(
    //   {
    //     customerId: customerId,
    //     accountName: changeAlias(accountName)
    //   },
    //   { showModalResponseError: false, showModalResponseCodeError: false }
    // );
  }

  async getVirtualAccount(customerId, accountName) {
    // const response = await PaymentService.getVA(
    //   {
    //     customerId: customerId
    //   },
    //   { showModalResponseError: false, showModalResponseCodeError: false }
    // );
    // if (!response) {
    //   return null;
    // }
    // if (response.result && response.responseCode === 200) {
    //   return response.result;
    // }
    //
    // if (response.errorCode === ERROR_CODE.DO_NOT_EXIST_VIRTUAL_ACCOUNT) {
    //   return await this.createVirtualAccount(customerId, accountName);
    // }
    //
    // return null;
  }

  async getCustomerInfo() {
    // const response = await CustomerService.getById(this.customerId, {
    //   showLoader: false
    // });
    // if (response.responseCode == 200) {
    //   if (!response.result || !response.result.personalData) {
    //     return null;
    //   }
    //   let customerInfoData = response.result.personalData;
    //
    //   if (response.result.kalapaData) {
    //     if (!response.result.kalapaData.createdAt) {
    //       customerInfoData.frontId = null;
    //       customerInfoData.backId = null;
    //       customerInfoData.selfie = null;
    //       this.customerInfo = customerInfoData;
    //       return;
    //     }
    //
    //     let ekycExpiredAt =
    //       PL_VALUE_DEFAULT.UNIX_TIMESTAMP_SAVE_EKYC_INFO +
    //       new Date(response.result.kalapaData.createdAt).getTime();
    //     if (new Date().getTime() > ekycExpiredAt) {
    //       customerInfoData.frontId = null;
    //       customerInfoData.backId = null;
    //       customerInfoData.selfie = null;
    //       this.customerInfo = customerInfoData;
    //       return;
    //     }
    //   }
    //
    //   await this.redirectToConfirmInformationPage();
    //   // await this.downloadEkycImages();
    // }
  }
}
