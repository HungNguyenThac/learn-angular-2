import { PAYDAY_LOAN_OTHER_STATUS } from './../../../../core/common/enum/payday-loan';
import { Component, Input, OnInit } from '@angular/core';
import { DATA_STATUS_TYPE } from '../../../../core/common/enum/operator';
import {
  PAYDAY_LOAN_STATUS,
  PAYDAY_LOAN_UI_STATUS,
  REPAYMENT_STATUS,
} from '../../../../core/common/enum/payday-loan';
import { PL_LABEL_STATUS } from '../../../../core/common/enum/label-status';
import { MultiLanguageService } from '../../../translate/multiLanguageService';

@Component({
  selector: 'app-pl-status-element',
  templateUrl: './pl-status-element.component.html',
  styleUrls: ['./pl-status-element.component.scss'],
})
export class PlStatusElementComponent implements OnInit {
  @Input() statusType: DATA_STATUS_TYPE;
  @Input() statusValue: string;

  constructor(private multiLanguageService: MultiLanguageService) {}

  get dataStatus() {
    switch (this.statusType) {
      case DATA_STATUS_TYPE.PL_HMG_STATUS:
      case DATA_STATUS_TYPE.PL_TNG_STATUS:
        return this.loanStatusContent(this.statusValue);
      case DATA_STATUS_TYPE.PL_UI_STATUS:
        return this.loanUIStatusContent(this.statusValue);
      case DATA_STATUS_TYPE.PL_OTHER_STATUS:
        return this.loanOtherStatusContent(this.statusValue);
      case DATA_STATUS_TYPE.PL_REPAYMENT_STATUS:
        return this.loanRepaymentStatusContent(this.statusValue);
      default:
        return {
          label: this.statusValue,
          labelStatus: this.statusType,
        };
    }
  }

  ngOnInit(): void {}

  loanUIStatusContent(status) {
    switch (status) {
      case PAYDAY_LOAN_UI_STATUS.NOT_COMPLETE_EKYC_YET:
        return {
          label: this.multiLanguageService.instant(
            `payday_loan.pl_ui_status.${status.toLowerCase()}`
          ),
          labelStatus: PL_LABEL_STATUS.REJECT,
        };
      case PAYDAY_LOAN_UI_STATUS.NOT_COMPLETE_FILL_EKYC_YET:
        return {
          label: this.multiLanguageService.instant(
            `payday_loan.pl_ui_status.${status.toLowerCase()}`
          ),
          labelStatus: PL_LABEL_STATUS.INFO,
        };
      case PAYDAY_LOAN_UI_STATUS.NOT_ACCEPTING_TERM_YET:
        return {
          label: this.multiLanguageService.instant(
            `payday_loan.pl_ui_status.${status.toLowerCase()}`
          ),
          labelStatus: PL_LABEL_STATUS.DISBURSEMENT,
        };
      case PAYDAY_LOAN_UI_STATUS.NOT_COMPLETE_CDE_YET:
        return {
          label: this.multiLanguageService.instant(
            `payday_loan.pl_ui_status.${status.toLowerCase()}`
          ),
          labelStatus: PL_LABEL_STATUS.PENDING,
        };
      case PAYDAY_LOAN_UI_STATUS.COMPLETED_CDE:
        return {
          label: this.multiLanguageService.instant(
            `payday_loan.pl_ui_status.${status.toLowerCase()}`
          ),
          labelStatus: PL_LABEL_STATUS.SUCCESS,
        };
      default:
        return {
          label: status,
          labelStatus: PL_LABEL_STATUS.REJECT,
        };
    }
  }

  loanOtherStatusContent(status) {
    switch (status) {
      case this.multiLanguageService.instant(
        PAYDAY_LOAN_OTHER_STATUS.NOT_RECEIVED_SALARY_YET
      ):
        return {
          label: this.statusValue,
          labelStatus: PL_LABEL_STATUS.PENDING,
        };
      case this.multiLanguageService.instant(
        PAYDAY_LOAN_OTHER_STATUS.RECEIVED_SALARY
      ):
        return {
          label: this.statusValue,
          labelStatus: PL_LABEL_STATUS.SUCCESS,
        };
      case this.multiLanguageService.instant(
        PAYDAY_LOAN_OTHER_STATUS.ACTIVE_USER
      ):
        return {
          label: this.statusValue,
          labelStatus: PL_LABEL_STATUS.SUCCESS,
        };
      case this.multiLanguageService.instant(
        PAYDAY_LOAN_OTHER_STATUS.INACTIVE_USER
      ):
        return {
          label: this.statusValue,
          labelStatus: PL_LABEL_STATUS.PENDING,
        };
      default:
        return {
          label: 'N/A',
          labelStatus: PL_LABEL_STATUS.REJECT,
        };
    }
  }

  loanRepaymentStatusContent(status) {
    switch (status) {
      case PAYDAY_LOAN_OTHER_STATUS.COMPLETED_PAID:
        return {
          label: this.multiLanguageService.instant('loan_app.loan_info.paid'),
          labelStatus: PL_LABEL_STATUS.SUCCESS,
        };
      default:
        return {
          label: this.multiLanguageService.instant('loan_app.loan_info.unpaid'),
          labelStatus: PL_LABEL_STATUS.PENDING,
        };
    }
  }

  loanStatusContent(status) {
    switch (status) {
      case REPAYMENT_STATUS.OVERDUE:
        return {
          label: this.multiLanguageService.instant(
            `payday_loan.repayment_status.${status.toLowerCase()}`
          ),
          labelStatus: PL_LABEL_STATUS.CANCEL,
        };
      case PAYDAY_LOAN_STATUS.DOCUMENTATION_COMPLETE:
      case PAYDAY_LOAN_STATUS.DOCUMENT_AWAITING:
      case PAYDAY_LOAN_STATUS.INITIALIZED:
      case PAYDAY_LOAN_STATUS.FUNDED:
      case PAYDAY_LOAN_STATUS.CONTRACT_AWAITING:
      case PAYDAY_LOAN_STATUS.AUCTION:
        return {
          label: this.multiLanguageService.instant(
            `payday_loan.status.${status.toLowerCase()}`
          ),
          labelStatus: PL_LABEL_STATUS.PENDING,
        };
      case PAYDAY_LOAN_STATUS.IN_REPAYMENT:
      case PAYDAY_LOAN_STATUS.CONTRACT_ACCEPTED:
        return {
          label: this.multiLanguageService.instant(
            `payday_loan.status.${status.toLowerCase()}`
          ),
          labelStatus: PL_LABEL_STATUS.SUCCESS,
        };
      case PAYDAY_LOAN_STATUS.COMPLETED:
        return {
          label: this.multiLanguageService.instant(
            `payday_loan.status.${status.toLowerCase()}`
          ),
          labelStatus: PL_LABEL_STATUS.INFO,
        };
      case PAYDAY_LOAN_STATUS.REJECTED:
      case PAYDAY_LOAN_STATUS.WITHDRAW:
        return {
          label: this.multiLanguageService.instant(
            `payday_loan.status.${status.toLowerCase()}`
          ),
          labelStatus: PL_LABEL_STATUS.REJECT,
        };
      case PAYDAY_LOAN_STATUS.AWAITING_DISBURSEMENT:
        return {
          label: this.multiLanguageService.instant(
            `payday_loan.status.${status.toLowerCase()}`
          ),
          labelStatus: PL_LABEL_STATUS.DISBURSEMENT,
        };
      default:
        return {
          label: status,
          labelStatus: PL_LABEL_STATUS.REJECT,
        };
    }
  }
}
