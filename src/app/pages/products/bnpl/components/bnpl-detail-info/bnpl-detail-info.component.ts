import { Component, Input, OnInit } from '@angular/core';
import {
  BnplApplication,
  CustomerInfo,
  PaydayLoanTng,
} from '../../../../../../../open-api-modules/dashboard-api-docs';
import {
  DATA_CELL_TYPE,
  DATA_STATUS_TYPE,
} from '../../../../../core/common/enum/operator';
import { MultiLanguageService } from '../../../../../share/translate/multiLanguageService';

@Component({
  selector: 'app-bnpl-detail-info',
  templateUrl: './bnpl-detail-info.component.html',
  styleUrls: ['./bnpl-detail-info.component.scss'],
})
export class BnplDetailInfoComponent implements OnInit {
  @Input() userInfo: CustomerInfo;

  _loanDetail: BnplApplication;
  @Input()
  get loanDetail(): BnplApplication {
    return this._loanDetail;
  }

  set loanDetail(value: PaydayLoanTng) {
    this._loanDetail = value;
    this.leftColumns = this._initLeftColumn();
    this.rightColumns = this._initRightColumn();
  }

  leftColumns: any[] = [];
  rightColumns: any[] = [];

  constructor(private multiLanguageService: MultiLanguageService) {}

  ngOnInit(): void {}

  private _initLeftColumn() {
    return [
      {
        title: this.multiLanguageService.instant('bnpl.loan_info.loan_code'),
        value: this.loanDetail?.id,
        type: DATA_CELL_TYPE.TEXT,
        format: null,
      },
      {
        title: this.multiLanguageService.instant('bnpl.loan_info.created_at'),
        value: this.loanDetail?.createdAt,
        type: DATA_CELL_TYPE.DATETIME,
        format: 'HH:mm:ss - dd/MM/yyyy',
      },
      {
        title: this.multiLanguageService.instant('bnpl.loan_info.merchant'),
        value: this.loanDetail?.merchant?.name,
        type: DATA_CELL_TYPE.HYPERLINK,
        format: `/system/merchant/list?id__e=${this.loanDetail?.merchant?.id}&accountClassification=ALL`,
      },
      {
        title: this.multiLanguageService.instant(
          'bnpl.loan_info.customer_name'
        ),
        value: this.loanDetail?.customerInfo?.firstName,
        type: DATA_CELL_TYPE.HYPERLINK,
        format: `/customer/list?id__e=${this.loanDetail?.customerId}&accountClassification=ALL`,
      },
      {
        title: this.multiLanguageService.instant('bnpl.loan_info.phone_number'),
        value: this.loanDetail?.customerInfo?.mobileNumber,
        type: DATA_CELL_TYPE.HYPERLINK,
        format: `/customer/list?id__e=${this.loanDetail?.customerId}&accountClassification=ALL`,
      },
    ];
  }

  private _initRightColumn() {
    return [
      {
        title: this.multiLanguageService.instant('bnpl.loan_info.status'),
        value: this.loanDetail?.status,
        type: DATA_CELL_TYPE.STATUS,
        format: DATA_STATUS_TYPE.BNPL_STATUS,
      },
    ];
  }
}
