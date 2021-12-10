import { Component, Input, OnInit } from '@angular/core';
import { PL_LABEL_STATUS } from '../../../../core/common/enum/label-status';

@Component({
  selector: 'pl-status-label',
  templateUrl: './pl-status-label.component.html',
  styleUrls: ['./pl-status-label.component.scss'],
})
export class PlStatusLabelComponent implements OnInit {
  @Input() statusType: string = PL_LABEL_STATUS.SUCCESS;

  get statusClasses() {
    return {
      'pl-status-label-initialized':
        this.statusType === PL_LABEL_STATUS.INITIALIZED,
      'pl-status-label-document-awaiting':
        this.statusType === PL_LABEL_STATUS.DOCUMENT_AWAITING,
      'pl-status-label-document-complete':
        this.statusType === PL_LABEL_STATUS.DOCUMENTATION_COMPLETE,
      'pl-status-label-auction': this.statusType === PL_LABEL_STATUS.AUCTION,
      'pl-status-label-funded': this.statusType === PL_LABEL_STATUS.FUNDED,
      'pl-status-label-contract-awaiting':
        this.statusType === PL_LABEL_STATUS.CONTRACT_AWAITING,
      'pl-status-label-contract-accepted':
        this.statusType === PL_LABEL_STATUS.CONTRACT_ACCEPTED,
      'pl-status-label-awaiting-disbursement':
        this.statusType === PL_LABEL_STATUS.AWAITING_DISBURSEMENT,
      'pl-status-label-disbursed':
        this.statusType === PL_LABEL_STATUS.DISBURSED,
      'pl-status-label-in-repayment':
        this.statusType === PL_LABEL_STATUS.IN_REPAYMENT,
      'pl-status-label-completed':
        this.statusType === PL_LABEL_STATUS.COMPLETED,
      'pl-status-label-rejected': this.statusType === PL_LABEL_STATUS.REJECTED,
      'pl-status-label-withdraw': this.statusType === PL_LABEL_STATUS.WITHDRAW,
      'pl-status-label-pending': this.statusType === PL_LABEL_STATUS.PENDING,
      'pl-status-label-success': this.statusType === PL_LABEL_STATUS.SUCCESS,
      'pl-status-label-disbursement':
        this.statusType === PL_LABEL_STATUS.DISBURSEMENT,
      'pl-status-label-rejected2': this.statusType === PL_LABEL_STATUS.REJECT,
      'pl-status-label-cancel': this.statusType === PL_LABEL_STATUS.CANCEL,
      'pl-status-label-info': this.statusType === PL_LABEL_STATUS.INFO,
    };
  }

  constructor() {}

  ngOnInit(): void {}
}
