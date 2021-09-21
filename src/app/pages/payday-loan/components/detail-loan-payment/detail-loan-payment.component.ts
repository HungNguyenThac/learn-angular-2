import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { PaydayLoan } from '../../../../../../open-api-modules/loanapp-api-docs';
import { CustomerInfoResponse } from '../../../../../../open-api-modules/customer-api-docs';
import { GlobalConstants } from '../../../../core/common/global-constants';
import { Router } from '@angular/router';
import { NotificationService } from '../../../../core/services/notification.service';
import { MultiLanguageService } from '../../../../share/translate/multiLanguageService';
import { PL_LABEL_STATUS } from 'src/app/core/common/enum/label-status';
import { PAYDAY_LOAN_STATUS } from '../../../../core/common/enum/payday-loan';
import * as moment from 'moment';

@Component({
  selector: 'pl-detail-loan-payment',
  templateUrl: './detail-loan-payment.component.html',
  styleUrls: ['./detail-loan-payment.component.scss'],
})
export class DetailLoanPaymentComponent implements OnInit {
  @Input() currentLoan: PaydayLoan;
  @Input() paidAmount: number;
  @Output() finalization = new EventEmitter<string>();

  get amountToBePaid() {
    return (
      this.currentLoan.expectedAmount +
      this.currentLoan.latePenaltyPayment -
      this.paidAmount
    );
  }

  get paymentFee() {
    return (
      (this.currentLoan.expectedAmount *
        GlobalConstants.PL_VALUE_DEFAULT.FIXED_REPAYMENT_GPAY_DYNAMIC) /
        100 +
      GlobalConstants.PL_VALUE_DEFAULT.FIXED_REPAYMENT_GPAY_FEE
    );
  }

  get loanStatusContent() {
    if (this.currentLoan.repaymentStatus) {
      if (this.currentLoan.repaymentStatus === 'OVERDUE') {
        return {
          label: this.multiLanguageService.instant(
            `payday_loan.current_loan.repayment_status.${this.currentLoan.repaymentStatus.toLowerCase()}`
          ),
          labelStatus: PL_LABEL_STATUS.CANCEL,
        };
      }
    }
    switch (this.currentLoan.status) {
      case PAYDAY_LOAN_STATUS.DOCUMENTATION_COMPLETE:
      case PAYDAY_LOAN_STATUS.DOCUMENT_AWAITING:
      case PAYDAY_LOAN_STATUS.INITIALIZED:
      case PAYDAY_LOAN_STATUS.AUCTION:
        return {
          label: this.multiLanguageService.instant(
            `payday_loan.current_loan.status.${this.currentLoan.status.toLowerCase()}`
          ),
          labelStatus: PL_LABEL_STATUS.PENDING,
        };
      case PAYDAY_LOAN_STATUS.FUNDED:
      case PAYDAY_LOAN_STATUS.IN_REPAYMENT:
      case PAYDAY_LOAN_STATUS.CONTRACT_AWAITING:
      case PAYDAY_LOAN_STATUS.CONTRACT_ACCEPTED:
        return {
          label: this.multiLanguageService.instant(
            `payday_loan.current_loan.status.${this.currentLoan.status.toLowerCase()}`
          ),
          labelStatus: PL_LABEL_STATUS.SUCCESS,
        };
      case PAYDAY_LOAN_STATUS.REJECTED:
      case PAYDAY_LOAN_STATUS.WITHDRAW:
        return {
          label: this.multiLanguageService.instant(
            `payday_loan.current_loan.status.${this.currentLoan.status.toLowerCase()}`
          ),
          labelStatus: PL_LABEL_STATUS.REJECT,
        };
      case PAYDAY_LOAN_STATUS.AWAITING_DISBURSEMENT:
        return {
          label: this.multiLanguageService.instant(
            `payday_loan.current_loan.status.${this.currentLoan.status.toLowerCase()}`
          ),
          labelStatus: PL_LABEL_STATUS.DISBURSEMENT,
        };
      default:
        return {
          label: this.currentLoan.status,
          labelStatus: PL_LABEL_STATUS.REJECT,
        };
    }
  }

  constructor(
    private router: Router,
    private notificationService: NotificationService,
    private multiLanguageService: MultiLanguageService
  ) {}

  ngOnInit(): void {}

  formatSettlementDate(value) {
    if (!value) {
      return 'N/A';
    }
    const createdDate = new Date(value);
    if (createdDate.getDate() > 15) {
      return '15/' + moment(createdDate).add(1, 'month').format('MM/YYYY');
    }

    return '15/' + moment(createdDate).format('MM/YYYY');
  }

  formatPunishStartTime(value) {
    if (!value) {
      return 'N/A';
    }

    const createdDate = new Date(value);
    if (createdDate.getDate() > 15) {
      return '00h, 16/' + moment(createdDate).add(1, 'month').format('MM/YYYY');
    }

    return '00h, 16/' + moment(createdDate).format('MM/YYYY');
  }

  finalizationClick() {
    this.finalization.emit('finalization');
  }
}
