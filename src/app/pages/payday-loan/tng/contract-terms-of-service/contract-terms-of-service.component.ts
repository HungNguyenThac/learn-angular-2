import {ChangeDetectorRef, Component, OnDestroy, OnInit} from '@angular/core';
import {ERROR_CODE} from 'src/app/core/common/enum/payday-loan';
import {MultiLanguageService} from "../../../../share/translate/multiLanguageService";
import * as moment from "moment";
import {MatDialog} from '@angular/material/dialog';
import {Subscription} from "rxjs";
import {PlPromptComponent} from "../../../../share/components";

@Component({
  selector: 'app-contract-terms-of-service',
  templateUrl: './contract-terms-of-service.component.html',
  styleUrls: ['./contract-terms-of-service.component.scss']
})
export class ContractTermsOfServiceComponent implements OnInit, OnDestroy {
  currentPage: number = 0;
  pageCount: number = 0;
  numPages: number = 0;
  page: number = 1;
  linkPdf: any = null;
  responsive: boolean = false;
  userInfo: any = {};
  contractInfo: any = {};
  isSentOtpOnsign: boolean = false;
  otp: any = [];
  mobile: string = "";
  errorText: string = "";
  errorGetTngInfo: boolean = false;
  disabledOTP: boolean = false;
  idDocument: string = null;
  idRequest: string = null;

  subManager = new Subscription();

  constructor(private multiLanguageService: MultiLanguageService,
              private dialog: MatDialog) {
  }

  get showSignContractTermsBtn() {
    return true;
  }

  ngOnInit(): void {
    this.onResponsiveInverted();
    window.addEventListener("resize", this.onResponsiveInverted);
  }

  ngOnDestroy(): void {
    window.removeEventListener("resize", this.onResponsiveInverted);
    this.subManager.unsubscribe();
  }

  openDialogPrompt() {
    const dialogRef = this.dialog.open(PlPromptComponent, {
      panelClass: 'custom-dialog-container',
      height: 'auto',
      minHeight: '194px',
      data: {
        imgBackgroundClass: "pl-sign-contract-prompt-image",
        imgGroupUrl: 'sprite-group-3-sign-contract-icon-prompt',
        title: this.multiLanguageService.instant('payday_loan.contract_terms_of_service.prompt_title'),
        content: this.multiLanguageService.instant('payday_loan.contract_terms_of_service.prompt_body'),
        secondaryBtnText: this.multiLanguageService.instant('payday_loan.contract_terms_of_service.disagree'),
        primaryBtnText: this.multiLanguageService.instant('payday_loan.contract_terms_of_service.agree'),
      },
    });

    this.subManager.add(
      dialogRef.afterClosed().subscribe((confirmed: boolean) => {
        console.log(confirmed)
      })
    );
  }

  confirmSign() {
    // this.destroyPrompt();
    // this.sendLetterOtp();
  }

  closePrompt() {
    // this.destroyPrompt();
  }

  async sendLetterOtp() {
    let params = this.buildParamsSendLetterOtp();
    // const response = await ComService.sentLetterOTP(params, {
    //   showModalResponseError: false,
    //   showModalResponseCodeError: false
    // });
    // if (response.responseCode === 200) {
    //   this.disabledOTP = false;
    //   this.idRequest = response.result.idRequest;
    //   this.idDocument = response.result.idDocument;
    // this.setSentOtpOnsignStatus(true);
    // return;
    // }
    // if (response.errorCode === ERROR_CODE.SESSION_SIGN_ALREADY_EXIST) {
    //   const currentOtpRequest = await this.getLatestApprovalLetter();
    //   if (
    //     currentOtpRequest &&
    //     currentOtpRequest.idRequest &&
    //     currentOtpRequest.idDocument
    //   ) {
    //     this.disabledOTP = false;
    //     this.setSentOtpOnsignStatus(true);
    //     return;
    //   }
    // }

    // if (response.errorCode === ERROR_CODE.LOCK_CREATE_NEW_SESSION) {
    //   this.disabledOTP = true;
    //   return this.showLockedSendOTPMessage(response.result.unLockTime);
    // }
    // this.showError({
    //   content:
    //     response.message === "Network Error"
    //       ? this.$t("common.network_error")
    //       : Configuration.value('VUE_APP_PRODUCTION') === "true"
    //         ? this.$t("common.something_went_wrong")
    //         : response.message
    // });
  }

  buildParamsSendLetterOtp() {
    return {
      email: this.userInfo.identityNumberSix,
      dateOfBirth: this.userInfo.dateOfBirth,
      name: this.userInfo.firstName,
      address: this.userInfo.addressOneLine1,
      mobile: this.userInfo.mobileNumber,
      nationalId: this.userInfo.identityNumberOne,
      // customerId: this.customerId,
      employeeCode: this.userInfo.organizationName,
      idIssuePlace: this.userInfo.idIssuePlace,
      documentPath: this.contractInfo.path
    };
  }

  onResponsiveInverted() {
    this.responsive = window.innerWidth < 768;
  }

  async resendOtp() {
    this.errorText = null;
    await this.sendLetterOtp();
  }

  verifyOtp(otp) {
    // this.errorText = null;
    // this.otp = otp.split("");
    //
    // const response = await ComService.confirmOtpSign({
    //   customerId: this.customerId,
    //   otp: otp,
    //   idRequest: this.idRequest,
    //   idDocument: this.idDocument
    // });
    //
    // if (response.responseCode == 200) {
    //   this.setSignedContractTermsStatus(true);
    //   await this.$router.push({ name: "PlSignContractTermsSuccess" });
    //   return;
    // }
    // this.handleErrorVerifyOtp(response);
  }

  signContract() {
    this.openDialogPrompt();
  }

  handleErrorVerifyOtp(response) {
    switch (response.errorCode) {
      case ERROR_CODE.OTP_INVALID:
      case ERROR_CODE.OTP_EXPIRE_TIME:
        this.errorText = this.multiLanguageService.instant(`payday_loan.error_code.` + response.errorCode.toLowerCase())
        if (response.result.remainingRequests == 0) {
          // this.showError({
          //   content: this.$t("payday_loan.error_code.otp_confirm_maximum")
          // });
          this.disabledOTP = true;
        } else {
          // this.showError({
          //   content: this.$t("payday_loan.n_type_wrong_otp", {
          //     remaining: response.result.remainingRequests
          //   })
          // });
        }
        break;
      case ERROR_CODE.OTP_CONFIRM_MAXIMUM:
        this.disabledOTP = true;
        this.errorText = this.multiLanguageService.instant(`payday_loan.error_code.` + response.errorCode.toLowerCase())
        // this.showError({
        //   content: this.$t("payday_loan.error_code.otp_confirm_maximum")
        // });
        break;
      default:
        break;
    }

    this.otp = [];
  }

  showLockedSendOTPMessage(unlockTime) {
    // this.showError({
    //   content: this.$t(
    //     "payday_loan.contract_terms_of_service.locked_sent_otp",
    //     {
    //       minute:
    //       PL_VALUE_DEFAULT.LOCKED_SEND_OTP_SIGN_CONTRACT_TERMS_MINUTES,
    //       unlock_timer: unlockTime
    //     }
    //   )
    // });
  }

  formatUnlockTimer(timer) {
    return moment(timer)
      .local()
      .format("DD-MM-yyyy HH:mm:ss");
  }
}
