import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-sign-contract-terms-success',
  templateUrl: './sign-contract-terms-success.component.html',
  styleUrls: ['./sign-contract-terms-success.component.scss']
})
export class SignContractTermsSuccessComponent implements OnInit {
  firstName: "";

  constructor() {
  }

  ngOnInit(): void {
  }

  redirectToAdditionalInformationPage() {
    // if (
    //   this.currentCustomerStatus &&
    //   PAYDAY_LOAN_UI_STATUS_ORDER_NUMBER[this.currentCustomerStatus] <
    //   PAYDAY_LOAN_UI_STATUS_ORDER_NUMBER.NOT_COMPLETE_CDE_YET
    // ) {
    //   this.setCustomerStatus(PAYDAY_LOAN_UI_STATUS.NOT_COMPLETE_CDE_YET);
    // }
    // this.setSignedContractTermsStatus(false);
    // this.setCustomerName("");
    // this.$router.push({ name: "PlAdditionalInformation" });
  }

}
