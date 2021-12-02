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
    };
  }

  constructor() {}

  ngOnInit(): void {}
}
