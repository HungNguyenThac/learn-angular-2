import { Component, OnInit } from '@angular/core';
import { PaydayLoan } from 'open-api-modules/loanapp-api-docs';

@Component({
  selector: 'app-loan-contract',
  templateUrl: './loan-contract.component.html',
  styleUrls: ['./loan-contract.component.scss'],
})
export class LoanContractComponent implements OnInit {
  loanId: string;
  loanDetail: PaydayLoan;

  loanContractView: any;
  loanContractData: any;
  contractStatus: string;
  loanContractFile: any;
  enableSign: boolean = false;
  constructor() {}

  ngOnInit(): void {}
}
