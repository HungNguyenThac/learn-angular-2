import { Component, Input, OnInit } from '@angular/core';
import { PaymentUserInfo } from '../../../../public/models/payment-user-info.model';
import { DATA_STATUS_TYPE } from '../../../../core/common/enum/operator';
import {
  PAYDAY_LOAN_HMG_STATUS,
  PAYDAY_LOAN_TNG_STATUS,
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

  get dataStatus() {
    switch (this.statusType) {
      case DATA_STATUS_TYPE.PL_HMG_STATUS:
        return this.loanHMGStatusContent(this.statusValue);
      case DATA_STATUS_TYPE.PL_TNG_STATUS:
        return this.loanTNGStatusContent(this.statusValue);
      case DATA_STATUS_TYPE.PL_UI_STATUS:
        return this.loanUIStatusContent(this.statusValue);
      default:
        return {
          label: this.statusValue,
          labelStatus: this.statusType,
        };
    }
  }

  constructor(private multiLanguageService: MultiLanguageService) {}

  ngOnInit(): void {}

  loanUIStatusContent(status) {
    switch (status) {
      case PAYDAY_LOAN_UI_STATUS.NOT_COMPLETE_EKYC_YET:
        return {
          label: this.multiLanguageService.instant(
            `payday_loan.pl_ui_status.${status.toLowerCase()}`
          ),
          labelStatus: PL_LABEL_STATUS.PENDING,
        };
      case PAYDAY_LOAN_UI_STATUS.NOT_COMPLETE_FILL_EKYC_YET:
        return {
          label: this.multiLanguageService.instant(
            `payday_loan.pl_ui_status.${status.toLowerCase()}`
          ),
          labelStatus: PL_LABEL_STATUS.PENDING,
        };
      case PAYDAY_LOAN_UI_STATUS.NOT_ACCEPTING_TERM_YET:
        return {
          label: this.multiLanguageService.instant(
            `payday_loan.pl_ui_status.${status.toLowerCase()}`
          ),
          labelStatus: PL_LABEL_STATUS.PENDING,
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

  loanTNGStatusContent(status) {
    switch (status) {
      case REPAYMENT_STATUS.OVERDUE:
        return {
          label: this.multiLanguageService.instant(
            `payday_loan.current_loan.repayment_status.${status.toLowerCase()}`
          ),
          labelStatus: PL_LABEL_STATUS.CANCEL,
        };
      case PAYDAY_LOAN_TNG_STATUS.DOCUMENTATION_COMPLETE:
      case PAYDAY_LOAN_TNG_STATUS.DOCUMENT_AWAITING:
      case PAYDAY_LOAN_TNG_STATUS.INITIALIZED:
      case PAYDAY_LOAN_TNG_STATUS.FUNDED:
      case PAYDAY_LOAN_TNG_STATUS.AUCTION:
        return {
          label: this.multiLanguageService.instant(
            `payday_loan.current_loan.status.${status.toLowerCase()}`
          ),
          labelStatus: PL_LABEL_STATUS.PENDING,
        };
      case PAYDAY_LOAN_TNG_STATUS.IN_REPAYMENT:
      case PAYDAY_LOAN_TNG_STATUS.CONTRACT_ACCEPTED:
        return {
          label: this.multiLanguageService.instant(
            `payday_loan.current_loan.status.${status.toLowerCase()}`
          ),
          labelStatus: PL_LABEL_STATUS.SUCCESS,
        };
      case PAYDAY_LOAN_TNG_STATUS.REJECTED:
      case PAYDAY_LOAN_TNG_STATUS.WITHDRAW:
        return {
          label: this.multiLanguageService.instant(
            `payday_loan.current_loan.status.${status.toLowerCase()}`
          ),
          labelStatus: PL_LABEL_STATUS.REJECT,
        };
      case PAYDAY_LOAN_TNG_STATUS.AWAITING_DISBURSEMENT:
        return {
          label: this.multiLanguageService.instant(
            `payday_loan.current_loan.status.${status.toLowerCase()}`
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

  loanHMGStatusContent(status) {
    switch (status) {
      case REPAYMENT_STATUS.OVERDUE:
        return {
          label: this.multiLanguageService.instant(
            `payday_loan.current_loan.repayment_status.${status.toLowerCase()}`
          ),
          labelStatus: PL_LABEL_STATUS.CANCEL,
        };
      case PAYDAY_LOAN_HMG_STATUS.DOCUMENTATION_COMPLETE:
      case PAYDAY_LOAN_HMG_STATUS.DOCUMENT_AWAITING:
      case PAYDAY_LOAN_HMG_STATUS.INITIALIZED:
      case PAYDAY_LOAN_HMG_STATUS.FUNDED:
      case PAYDAY_LOAN_HMG_STATUS.CONTRACT_AWAITING:
      case PAYDAY_LOAN_HMG_STATUS.AUCTION:
        return {
          label: this.multiLanguageService.instant(
            `payday_loan.current_loan.status.${status.toLowerCase()}`
          ),
          labelStatus: PL_LABEL_STATUS.PENDING,
        };
      case PAYDAY_LOAN_HMG_STATUS.IN_REPAYMENT:
      case PAYDAY_LOAN_HMG_STATUS.CONTRACT_ACCEPTED:
        return {
          label: this.multiLanguageService.instant(
            `payday_loan.current_loan.status.${status.toLowerCase()}`
          ),
          labelStatus: PL_LABEL_STATUS.SUCCESS,
        };
      case PAYDAY_LOAN_HMG_STATUS.REJECTED:
      case PAYDAY_LOAN_HMG_STATUS.WITHDRAW:
        return {
          label: this.multiLanguageService.instant(
            `payday_loan.current_loan.status.${status.toLowerCase()}`
          ),
          labelStatus: PL_LABEL_STATUS.REJECT,
        };
      case PAYDAY_LOAN_HMG_STATUS.AWAITING_DISBURSEMENT:
        return {
          label: this.multiLanguageService.instant(
            `payday_loan.current_loan.status.${status.toLowerCase()}`
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
