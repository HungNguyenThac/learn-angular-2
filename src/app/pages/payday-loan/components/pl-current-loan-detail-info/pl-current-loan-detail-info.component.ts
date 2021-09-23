import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {MultiLanguageService} from '../../../../share/translate/multiLanguageService';
import {GPAY_RESULT_STATUS, PAYDAY_LOAN_STATUS, REPAYMENT_STATUS,} from '../../../../core/common/enum/payday-loan';
import {PL_LABEL_STATUS} from 'src/app/core/common/enum/label-status';
import {PaydayLoan} from '../../../../../../open-api-modules/loanapp-api-docs';
import {CustomerInfoResponse} from '../../../../../../open-api-modules/customer-api-docs';

@Component({
  selector: 'pl-current-loan-detail-info',
  templateUrl: './pl-current-loan-detail-info.component.html',
  styleUrls: ['./pl-current-loan-detail-info.component.scss'],
})
export class PlCurrentLoanDetailInfoComponent implements OnInit {
  @Input() currentLoan: PaydayLoan;
  @Input() userInfo: CustomerInfoResponse;
  @Input() paymentStatus: string;

  @Output() viewContract = new EventEmitter<string>();
  @Output() finalization = new EventEmitter<string>();

  disabledBtn: boolean = false;

  get loanStatusContent() {
    if (this.currentLoan.repaymentStatus) {
      if (this.currentLoan.repaymentStatus === REPAYMENT_STATUS.OVERDUE) {
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
      case PAYDAY_LOAN_STATUS.FUNDED:
      case PAYDAY_LOAN_STATUS.CONTRACT_AWAITING:
      case PAYDAY_LOAN_STATUS.AUCTION:
        return {
          label: this.multiLanguageService.instant(
            `payday_loan.current_loan.status.${this.currentLoan.status.toLowerCase()}`
          ),
          labelStatus: PL_LABEL_STATUS.PENDING,
        };
      case PAYDAY_LOAN_STATUS.IN_REPAYMENT:
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

  get showMessageGuideSignContract() {
    return this.currentLoan.status === PAYDAY_LOAN_STATUS.FUNDED;
  }

  get showMessageWaitingEpaySignature() {
    return this.currentLoan.status === PAYDAY_LOAN_STATUS.CONTRACT_AWAITING;
  }

  get showMessageWaitingApproval() {
    return (
      this.currentLoan.status === PAYDAY_LOAN_STATUS.INITIALIZED ||
      this.currentLoan.status === PAYDAY_LOAN_STATUS.DOCUMENT_AWAITING ||
      this.currentLoan.status === PAYDAY_LOAN_STATUS.DOCUMENTATION_COMPLETE
    );
  }

  get showMessageGuideCompleteContract() {
    return (
      this.currentLoan.status === PAYDAY_LOAN_STATUS.DOCUMENTATION_COMPLETE ||
      this.currentLoan.status === PAYDAY_LOAN_STATUS.DOCUMENT_AWAITING ||
      this.currentLoan.status === PAYDAY_LOAN_STATUS.CONTRACT_AWAITING ||
      this.currentLoan.status === PAYDAY_LOAN_STATUS.FUNDED ||
      this.currentLoan.status === PAYDAY_LOAN_STATUS.INITIALIZED
    );
  }

  get showMessagePaymentProcessing() {
    return (
      this.currentLoan.status === PAYDAY_LOAN_STATUS.IN_REPAYMENT &&
      (this.paymentStatus === GPAY_RESULT_STATUS.ORDER_PENDING ||
        this.paymentStatus === GPAY_RESULT_STATUS.ORDER_VERIFYING ||
        this.paymentStatus === GPAY_RESULT_STATUS.ORDER_PROCESSING)
    );
  }

  get disabledBtnFinalization() {
    return (
      this.disabledBtn ||
      this.paymentStatus === GPAY_RESULT_STATUS.ORDER_PENDING ||
      this.paymentStatus === GPAY_RESULT_STATUS.ORDER_VERIFYING ||
      this.paymentStatus === GPAY_RESULT_STATUS.ORDER_PROCESSING
    );
  }

  constructor(private multiLanguageService: MultiLanguageService) {
  }

  ngOnInit(): void {
  }

  viewContractTrigger() {
    this.viewContract.emit('viewContract');
  }

  finalizationTrigger() {
    if (this.disabledBtn) return;
    this.finalization.emit('finalization');
  }

  additionalDocument() {
    // this.$router.push({ name: "PlAdditionalDocument" });
  }
}
