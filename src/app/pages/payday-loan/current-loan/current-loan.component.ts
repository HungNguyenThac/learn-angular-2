import {Component, OnInit} from '@angular/core';
import {MultiLanguageService} from "../../../share/translate/multiLanguageService";
import {GPAY_RESULT_STATUS, PAYDAY_LOAN_STATUS, REPAYMENT_STATUS} from "../../../core/common/enum/payday-loan";
import * as moment from "moment";

@Component({
  selector: 'pl-current-loan',
  templateUrl: './current-loan.component.html',
  styleUrls: ['./current-loan.component.scss']
})
export class CurrentLoanComponent implements OnInit {
  currentLoan: any = {
    id: null,
    expectedAmount: null,
    loanCode: null,
    disbursementDate: null,
    loanStatus: null,
    totalServiceFees: 0,
    repaymentStatus: null,
    getSalaryAt: null
  };

  contractInfo: any = {
    status: null
  };

  userInfo: any = {
    fullName: null,
    dateOfBirth: null,
    gender: null,
    identityNumberOne: null,
    workingTime: null,
    totalSalary: null,
    email: null,
    accountReceiveSalary: null,
    bank: null,
    phoneNumber: null
  };

  constructor(private multiLanguageService: MultiLanguageService) {
  }

  ngOnInit(): void {
  }
  viewContract() {
    // this.$router.push({ name: "PlSignContract" });
  }

  finalization() {
    // this.$router.push({ name: "PlLoanPayment" });
  }

  initPageTitle(status) {
    let pageTitle = this.getPageTitle(status);
    window.document.title =
      pageTitle + " - " + this.multiLanguageService.instant("common.project_name");
  }

  async initInfo() {
    // if (this.isChooseAmountSuccess) {
    //   this.showLoading({
    //     content: {
    //       title: this.multiLanguageService.instant("payday_loan.in_progress"),
    //       content: this.multiLanguageService.instant("payday_loan.wait_a_minute")
    //     }
    //   });
    //   setTimeout(async () => {
    //     this.hideLoading();
    //     this.resetChooseAmountSuccess();
    //     await this.getActiveLoan(false, true);
    //     await this.getContractCurrentLoan(false, true);
    //   }, 5000);
    //   return;
    // }
    await this.getActiveLoan();
    await this.getContractCurrentLoan();
  }

  async getContractCurrentLoan(showLoading = true, otherLoader = false) {
    // if (!this.currentLoan.id || !this.customerId) return;
    // const response = await LoanService.getContract(
    //   { loanId: this.currentLoan.id, customerId: this.customerId },
    //   {
    //     showModalResponseCodeError: false,
    //     showLoader: showLoading,
    //     otherLoader: otherLoader
    //   }
    // );
    // if (response.responseCode == 200) {
    //   let contractInfo = response.result;
    //   this.contractInfo.status = contractInfo.status;
    // }
  }

  async getActiveLoan(showLoading = true, otherLoader = false) {
    // const response = await LoanService.getActiveLoan(
    //   this.customerId,
    //   this.coreToken,
    //   {
    //     showModalResponseCodeError: false,
    //     showLoader: showLoading,
    //     otherLoader: otherLoader
    //   }
    // );
    // if (response.errorCode) {
    //   return this.handleGetActiveLoanError(response);
    // }
    // if (response.responseCode == 200) {
    //   let loanInfo = response.result;
    //
    //   if (
    //     this.countdownTimeStatus &&
    //     loanInfo.status !== PAYDAY_LOAN_STATUS.IN_REPAYMENT
    //   ) {
    //     this.showModalCloseWebsiteCountdown();
    //     return;
    //   }
    //
    //   if (
    //     this.currentCloseWebsiteStatus &&
    //     loanInfo.status !== PAYDAY_LOAN_STATUS.IN_REPAYMENT
    //   ) {
    //     this.showModalCloseWebsite();
    //     return;
    //   }
    //   this.currentLoan.id = loanInfo.id;
    //   this.currentLoan.loanCode = loanInfo.loanCode;
    //   this.currentLoan.expectedAmount = loanInfo.expectedAmount || 0;
    //   // this.currentLoan.getSalaryAt = this.formatGetSalaryDate(
    //   //     loanInfo.getSalaryAt
    //   // );
    //   this.currentLoan.loanStatus = loanInfo.status;
    //   this.currentLoan.totalServiceFees = loanInfo.totalServiceFees || 0;
    //   this.currentLoan.repaymentStatus = loanInfo.repaymentStatus;
    //   this.setPaymentStatus(loanInfo.repaymentStatus);
    //   if (
    //     this.$route.params.status !==
    //     formatSlug(loanInfo.status || PAYDAY_LOAN_STATUS.UNKNOWN_STATUS)
    //   ) {
    //     await this.$router.replace({
    //       name: "PlCurrentLoan",
    //       params: {
    //         status: formatSlug(
    //           loanInfo.status || PAYDAY_LOAN_STATUS.UNKNOWN_STATUS
    //         )
    //       }
    //     });
    //     this.initPageTitle(
    //       loanInfo.status || PAYDAY_LOAN_STATUS.UNKNOWN_STATUS
    //     );
    //   }
    // }
    await this.getUserInfo();
  }

  formatGetSalaryDate(value) {
    return value
      ? moment(new Date(value), "DD/MM/YYYY HH:mm:ss")
        .add(1, "day")
        .format("DD/MM/YYYY HH:mm:ss")
      : "N/A";
  }

  async getUserInfo() {
    // const response = await CustomerService.getById(this.customerId);
    //
    // if (response.responseCode == 200) {
    //   let info = response.result;
    //   this.userInfo.fullName = info.personalData.firstName;
    //   this.userInfo.dateOfBirth = info.personalData.dateOfBirth;
    //   this.userInfo.gender = info.personalData.gender;
    //   this.userInfo.identityNumberOne = info.personalData.identityNumberOne;
    //   this.userInfo.workingTime =
    //     info.personalData.borrowerEmploymentHistoryTextVariable1;
    //   this.userInfo.totalSalary = info.personalData.annualIncome;
    //   this.userInfo.email = info.personalData.identityNumberSix;
    //   this.userInfo.phoneNumber = info.personalData.mobileNumber;
    //   this.userInfo.accountReceiveSalary = info.financialData.accountNumber;
    //   this.userInfo.bank = info.financialData.bankCode;
    // }
  }

  getPageTitle(status) {
    const currentLoanStatus = this.getStatusFromSlug(status);

    if (!currentLoanStatus) {
      return this.multiLanguageService.instant(`page_title.current_loan`);
    }

    let paydayLoanStatuses = Object.values(PAYDAY_LOAN_STATUS);
    let gpayStatuses = Object.values(GPAY_RESULT_STATUS);
    let repaymentStatuses = Object.values(REPAYMENT_STATUS);

    if (paydayLoanStatuses.includes(currentLoanStatus)) {
      return this.multiLanguageService.instant(
        `payday_loan.current_loan.status.${currentLoanStatus.toLowerCase()}`
      );
    }

    if (gpayStatuses.includes(currentLoanStatus)) {
      return this.multiLanguageService.instant(
        `payday_loan.current_loan.gpay_status.${currentLoanStatus.toLowerCase()}`
      );
    }

    if (repaymentStatuses.includes(currentLoanStatus)) {
      return this.multiLanguageService.instant(
        `payday_loan.current_loan.repayment_status.${currentLoanStatus.toLowerCase()}`
      );
    }

    return this.multiLanguageService.instant(`page_title.current_loan`);
  }

  getStatusFromSlug(value) {
    return value ? value.toUpperCase()?.replace(/-/g, "_") : null;
  }

  handleGetActiveLoanError(response) {
    if (response.errorCode === "DO_NOT_ACTIVE_LOAN_ERROR") {
      // this.createNewPaydayLoan();
      return;
    }

    // this.showError({
    //   title:
    //     Configuration.value('VUE_APP_PRODUCTION') === "true"
    //       ? this.multiLanguageService.instant("common.error")
    //       : response.errorCode,
    //   content:
    //     response.message === "Network Error"
    //       ? this.multiLanguageService.instant("common.network_error")
    //       : Configuration.value('VUE_APP_PRODUCTION') === "true"
    //         ? this.multiLanguageService.instant("common.something_went_wrong")
    //         : response.message
    // });
  }
}
