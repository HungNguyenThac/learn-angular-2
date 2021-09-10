import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'ekyc-upload',
  templateUrl: './ekyc-upload.component.html',
  styleUrls: ['./ekyc-upload.component.scss']
})
export class EkycUploadComponent implements OnInit {
  _customerInfo: any;
  get customerInfo(): any {
    return this._customerInfo;
  }

  @Input() set customerInfo(newVal: any) {
    if (newVal != this._customerInfo) {
      this.initValue = {
        frontID: newVal.frontId,
        backID: newVal.backId,
        selfie: newVal.selfie
      };
      this.frontID = newVal.frontId;
      this.backID = newVal.backId;
      this.selfie = newVal.selfie;
    }
    this._customerInfo = newVal;
  }


  @Output() redirectToConfirmInformationPage = new EventEmitter<string>();
  @Output() completeEkyc = new EventEmitter<any>();

  params: any = {
    frontIdentityCardImg: null,
    backIdentityCardImg: null,
    selfieImg: null
  };
  initValue: any = {
    frontID: null,
    backID: null,
    selfie: null
  };
  frontID: any = null;
  backID: any = null;
  selfie: any = null;

  constructor() {
  }

  ngOnInit(): void {
  }

  resultFrontIdCard(result) {
    this.params.frontIdentityCardImg = result.file;
    this.frontID = result.imgSrc;
  }

  resultBackIdCard(result) {
    this.params.backIdentityCardImg = result.file;
    this.backID = result.imgSrc;
  }

  resultSelfie(result) {
    this.params.selfieImg = result.file;
    this.selfie = result.imgSrc;
  }

  async submit() {
    console.log('submit')
    if (
      this.initValue.frontID != null &&
      this.initValue.backID != null &&
      this.initValue.selfie != null &&
      this.initValue.frontID === this.frontID &&
      this.initValue.backID === this.backID &&
      this.initValue.selfie === this.selfie
    ) {
      this.redirectToConfirmInformationPage.emit("redirectToConfirmInformationPage");
      return;
    }

    if (
      !this.params.frontIdentityCardImg ||
      !this.params.backIdentityCardImg ||
      !this.params.selfieImg
    )
      return;

    // const ekycInfo = await CustomerService.completeEkyc(
    //   this.params.frontIdentityCardImg,
    //   this.params.backIdentityCardImg,
    //   this.params.selfieImg
    // );
    // if (ekycInfo.responseCode !== 200) {
    //   this.resetParams();
    //   this.showError({
    //     title: this.$t("payday_loan.ekyc.ekyc_failed_title"),
    //     content: this.$t("payday_loan.ekyc.ekyc_failed_content")
    //   });
    //   return;
    // }
    // if (!ekycInfo.result) {
    //   this.resetParams();
    //   this.showError({
    //     content: this.$t("common.unknown_error")
    //   });
    //   return;
    // }
    // this.completeEkyc.emit({
    //     result: ekycInfo.result, params: this.params
    //   }
    // );
  }

  resetParams() {
    this.params = {
      frontIdentityCardImg: null,
      backIdentityCardImg: null,
      selfieImg: null
    };
    this.frontID = null;
    this.backID = null;
    this.selfie = null;
  }
}
