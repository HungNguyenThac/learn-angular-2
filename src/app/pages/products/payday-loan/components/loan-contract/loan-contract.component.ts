import { MultiLanguageService } from 'src/app/share/translate/multiLanguageService';
import { DomSanitizer } from '@angular/platform-browser';
import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { PaydayLoan } from 'open-api-modules/loanapp-api-docs';
import {
  DATA_CELL_TYPE,
  DATA_STATUS_TYPE,
} from 'src/app/core/common/enum/operator';

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
    this.getDisplayStatus();
  }

  loanContractView: any;
  loanContractData: any;
  contractStatus: string;
  loanContractFile: any;
  enableSign: boolean = false;
  displayStatus;
  constructor(
    private notifier: ToastrService,
    private dialog: MatDialog,
    private domSanitizer: DomSanitizer,
    private multiLanguageService: MultiLanguageService
  ) {}

  ngOnInit(): void {}

  getDisplayStatus() {
    this.displayStatus = {
      title: this.multiLanguageService.instant(
        'loan_app.loan_info.loan_status'
      ),
      value: this.loanDetail?.status,
      type: DATA_CELL_TYPE.STATUS,
      format: DATA_STATUS_TYPE.PL_HMG_STATUS,
    };
    return this.displayStatus;
  }
}
