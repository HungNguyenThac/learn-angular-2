import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'ekyc',
  templateUrl: './ekyc.component.html',
  styleUrls: ['./ekyc.component.scss']
})
export class EkycComponent implements OnInit {
  customerInfo: any;

  constructor() { }

  ngOnInit(): void {
  }

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
    // if (!ekycCompleteData || !ekycCompleteData.idCardInfo) {
    //   this.showError({
    //     content: this.$t("common.unknown_error")
    //   });
    //   return;
    // }
    //
    // let ekycInfo = this.bindEkycData(ekycCompleteData.idCardInfo);
    // this.setEkycInfo(ekycInfo);
    //
    // await this.getVirtualAccount(this.customerId, ekycInfo.name);
    //
    // if (
    //   this.currentCustomerStatus &&
    //   PAYDAY_LOAN_UI_STATUS_ORDER_NUMBER[this.currentCustomerStatus] <
    //   PAYDAY_LOAN_UI_STATUS_ORDER_NUMBER.NOT_COMPLETE_FILL_EKYC_YET
    // ) {
    //   await this.setCustomerStatus(
    //     PAYDAY_LOAN_UI_STATUS.NOT_COMPLETE_FILL_EKYC_YET
    //   );
    // }
    //
    // await this.showModal({ type: MODAL_TYPE.PL_SUCCESS });
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

  bindEkycData(idCardInfo) {
    return {
      name: idCardInfo.name || "",
      dob: idCardInfo.dob || "",
      id_address: idCardInfo.address || "",
      id_origin: idCardInfo.home || "",
      gender: idCardInfo.gender || "",
      id_number: idCardInfo.id || "",
      dateOfIssue: idCardInfo.dateOfIssue || "",
      placeOfIssue: idCardInfo.placeOfIssue || "",
      documentType: idCardInfo.documentType || "",
      features: idCardInfo.features || "",
      expiredDate: idCardInfo.expiredDate || ""
    };
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
