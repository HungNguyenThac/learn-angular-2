import { Component, Input, OnInit } from '@angular/core';
import { CustomerInfo } from '../../../../../../../open-api-modules/dashboard-api-docs';
import { MatTableDataSource } from '@angular/material/table';
import { DisplayedFieldsModel } from '../../../../../public/models/filter/displayed-fields.model';
import { DATA_CELL_TYPE } from '../../../../../core/common/enum/operator';
import { Store } from '@ngrx/store';
import { MultiLanguageService } from '../../../../../share/translate/multiLanguageService';
import * as fromActions from '../../../../../core/store';
import * as fromStore from '../../../../../core/store';
import * as fromSelectors from '../../../../../core/store/selectors';
import { PageEvent } from '@angular/material/paginator/public-api';
import { Sort } from '@angular/material/sort';

@Component({
  selector: 'app-bnpl-repayment-transaction',
  templateUrl: './bnpl-repayment-transaction.component.html',
  styleUrls: ['./bnpl-repayment-transaction.component.scss'],
})
export class BnplRepaymentTransactionComponent implements OnInit {
  @Input() loanDetail: any;
  @Input() userInfo: CustomerInfo;

  dataSource: MatTableDataSource<any> = new MatTableDataSource([]);
  expandedElementLoanDetail: any;

  allColumns: DisplayedFieldsModel[] = [
    {
      key: 'createdAt',
      title: this.multiLanguageService.instant('bnpl.loan_info.created_at'),
      type: DATA_CELL_TYPE.DATETIME,
      format: 'dd/MM/yyyy HH:mm:ss',
      showed: true,
    },
  ];

  constructor(
    private store: Store<fromStore.State>,
    private multiLanguageService: MultiLanguageService
  ) {}

  ngOnInit(): void {}
}
