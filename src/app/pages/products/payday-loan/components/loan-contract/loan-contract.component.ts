import { DomSanitizer } from '@angular/platform-browser';
import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { PaydayLoan } from 'open-api-modules/loanapp-api-docs';

@Component({
  selector: 'app-loan-contract',
  templateUrl: './loan-contract.component.html',
  styleUrls: ['./loan-contract.component.scss'],
})
export class LoanContractComponent implements OnInit {
  _loanId: string;
  @Input()
  get loanId(): string {
    return this._loanId;
  }

  set loanId(value: string) {
    this._loanId = value;
  }
  
  _loanDetail: PaydayLoan;
  @Input()
  get loanDetail(): PaydayLoan {
    return this._loanDetail;
  }

  set loanDetail(value: PaydayLoan) {
    this._loanDetail = value;
  }

  loanContractView: any;
  loanContractData: any;
  contractStatus: string;
  loanContractFile: any;
  enableSign: boolean = false;
  constructor(
    private notifier: ToastrService,
    private dialog: MatDialog,
    private domSanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {}
}
