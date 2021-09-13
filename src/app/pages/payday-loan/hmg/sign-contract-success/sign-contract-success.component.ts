import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-sign-contract-success',
  templateUrl: './sign-contract-success.component.html',
  styleUrls: ['./sign-contract-success.component.scss']
})
export class SignContractSuccessComponent implements OnInit {
  firstName: "";
  loanCode: "";

  constructor() {
  }

  ngOnInit(): void {
  }

  redirectToCurrentLoanPage() {

  }
}
