import { LoanListService } from './loan-list.service';
import { PageEvent } from '@angular/material/paginator/public-api';
import { Sort } from '@angular/material/sort';
import {
  ApiResponseSearchAndPaginationResponseCompanyInfo,
  ApiResponseSearchAndPaginationResponsePaydayLoanHmg,
  ApiResponseSearchAndPaginationResponsePaydayLoanTng
} from '../../../../../../open-api-modules/dashboard-api-docs';
import { CustomerListService } from '../../../customer/customer-list/customer-list.service';
import { CompanyControllerService } from '../../../../../../open-api-modules/dashboard-api-docs';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { BreadcrumbOptionsModel } from '../../../../public/models/external/breadcrumb-options.model';
import { Subscription, Observable } from 'rxjs';
import { SearchAndPaginationResponseCompanyInfo } from '../../../../../../open-api-modules/dashboard-api-docs';
import {
  DATA_CELL_TYPE,
  DATA_STATUS_TYPE,
  QUERY_CONDITION_TYPE,
} from '../../../../core/common/enum/operator';
import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { GlobalConstants } from 'src/app/core/common/global-constants';
import { Store } from '@ngrx/store';
import * as fromActions from '../../../../core/store';
import * as fromStore from '../../../../core/store';
import * as fromSelectors from '../../../../core/store/selectors';
import { NAV_ITEM } from '../../../../core/common/enum/operator';
import { MultiLanguageService } from '../../../../share/translate/multiLanguageService';
import { MatTableDataSource } from '@angular/material/table';
import { FormBuilder, FormGroup } from '@angular/forms';
@Component({
  selector: 'app-loan-list',
  templateUrl: './loan-list.component.html',
  styleUrls: ['./loan-list.component.scss'],
})
export class LoanListComponent implements OnInit {
  companyList: SearchAndPaginationResponseCompanyInfo;
  subManager = new Subscription();
  tableTitle: string = this.multiLanguageService.instant(
    'page_title.loan_list'
  );
  breadcrumbOptions: BreadcrumbOptionsModel = {
    title: 'Vay ứng lương - HMG',
    iconImgSrc: 'assets/img/icon/group-5/pl-24-available.png',
    searchPlaceholder: 'Mã khoản vay, Tên, Số điện thoại...',
    searchable: true,
    showBtnAdd: true,
    btnAddText: 'Thêm nhà cung cấp',
  };

  allColumns: any[] = [
    {
      key: 'loanCode',
      title: this.multiLanguageService.instant('loan_app.loan_info.loan_code'),
      type: DATA_CELL_TYPE.TEXT,
      format: null,
      showed: true,
    },
    {
      key: 'status',
      title: this.multiLanguageService.instant('loan_app.loan_info.status'),
      type: DATA_CELL_TYPE.STATUS,
      format: DATA_STATUS_TYPE.PL_HMG_STATUS,
      showed: true,
    },
    {
      key: 'customerName',
      title: this.multiLanguageService.instant('loan_app.loan_info.customer'),
      type: DATA_CELL_TYPE.TEXT,
      format: null,
      showed: true,
    },
    {
      key: 'mobileNumber',
      title: this.multiLanguageService.instant(
        'loan_app.loan_info.phone_number'
      ),
      type: DATA_CELL_TYPE.TEXT,
      format: null,
      showed: true,
    },
    {
      key: 'tenure',
      title: this.multiLanguageService.instant('loan_app.loan_info.loan_term'),
      type: DATA_CELL_TYPE.TEXT,
      format: null,
      showed: true,
    },
    {
      key: 'createdAt',
      title: this.multiLanguageService.instant(
        'loan_app.loan_info.register_at'
      ),
      type: DATA_CELL_TYPE.DATETIME,
      format: 'dd/MM/yyyy HH:mm',
      showed: true,
    },
  ];
  dataSource: MatTableDataSource<any> = new MatTableDataSource([]);
  expandedElementLoanId: string;
  expandedElementCustomerId: string;
  pages: Array<number>;
  pageSize: number = 10;
  pageIndex: number = 0;
  pageLength: number = 0;
  pageSizeOptions: number[] = [10, 20, 50];
  totalItems: number = 0;
  filterForm: FormGroup;
  private readonly routeAllState$: Observable<Params>;

  constructor(
    private titleService: Title,
    private store: Store<fromStore.State>,
    private multiLanguageService: MultiLanguageService,
    private customerListService: CustomerListService,
    private companyControllerService: CompanyControllerService,
    private formBuilder: FormBuilder,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private loanListService: LoanListService
  ) {
    this.routeAllState$ = store.select(fromSelectors.getRouterAllState);
    this._initFilterForm();
  }

  ngOnInit(): void {
    this.titleService.setTitle(
      this.multiLanguageService.instant('page_title.loan_list') +
        ' - ' +
        GlobalConstants.PL_VALUE_DEFAULT.PROJECT_NAME
    );
    this.store.dispatch(new fromActions.SetOperatorInfo(NAV_ITEM.LOANAPP));
    this._initSubscription();
  }

  private _initFilterForm() {
    this.filterForm = this.formBuilder.group({
      keyword: [''],
      companyId: [''],
      groupName: [''],
      loanCode: [''],
      mobileNumber: [''],
      status: [''],
      orderBy: ['createdAt'],
      sortDirection: ['desc'],
      startTime: [''],
      endTime: [''],
      filterConditions: {
        keyword: QUERY_CONDITION_TYPE.LIKE,
        companyId: QUERY_CONDITION_TYPE.EQUAL,
        // status: QUERY_CONDITION_TYPE.EQUAL,
        // loanCode: QUERY_CONDITION_TYPE.LIKE,
        // mobileNumber: QUERY_CONDITION_TYPE.LIKE,
      },
    });
  }

  private _parseQueryParams(params) {
    let filterConditionsValue =
      this.filterForm.controls.filterConditions?.value;

    for (const [param, paramValue] of Object.entries(params)) {
      let paramHasCondition = param.split('__');
      if (paramHasCondition.length > 1) {
        this.filterForm.controls[paramHasCondition[0]].setValue(
          paramValue || ''
        );
        filterConditionsValue[paramHasCondition[0]] =
          '__' + paramHasCondition[1];
      } else {
        if (this.filterForm.controls[param]) {
          this.filterForm.controls[param].setValue(paramValue || '');
        }
      }
    }

    this.filterForm.patchValue({
      filterConditions: filterConditionsValue,
      keyword: params.keyword,
      orderBy: params.orderBy || 'createdAt',
      sortDirection: params.sortDirection || 'desc',
      startTime: params.startTime,
      endTime: params.endTime,
    });

    this.breadcrumbOptions.keyword = params.keyword;
    this.pageIndex = params.pageIndex || 0;
    this.pageSize = params.pageSize || 20;
  }

  private _initSubscription() {
    this.subManager.add(
      this.routeAllState$.subscribe((params) => {
        this._parseQueryParams(params?.queryParams);
        this._getLoanList();
        this._getCompanyList();
      })
    );
  }

  private _getLoanList() {
    const params = this._buildParams();
    if (params.groupName === "HMG") {
      this.subManager.add(
        this.loanListService
          .getLoanDataHmg(params)
          .subscribe((data: ApiResponseSearchAndPaginationResponsePaydayLoanHmg) => {
            this._parseData(data?.result);
          })
      );
    }

    if (params.groupName === 'TNG') {
      this.subManager.add(
        this.loanListService
          .getLoanDataTng(params)
          .subscribe((data: ApiResponseSearchAndPaginationResponsePaydayLoanTng) => {
            this._parseData(data?.result);
          })
      );
    }
  }

  private _getCompanyList() {
    this.subManager.add(
      this.companyControllerService
        .getCompanies(10, 0, {})
        .subscribe(
          (data: ApiResponseSearchAndPaginationResponseCompanyInfo) => {
            this.companyList = data?.result;
          }
        )
    );
  }

  private _buildParams() {
    const data = this.filterForm.getRawValue();
    data.offset = this.pageIndex * this.pageSize;
    data.pageSize = this.pageSize;
    data.pageNumber = this.pageIndex;
    return data;
  }

  private _parseData(rawData) {
    this.pageLength = rawData?.pagination?.maxPage || 0;
    this.totalItems = rawData?.pagination?.total || 0;
    this.dataSource.data = rawData?.searchPaydayLoanResult || [];
  }

  onPageChange(event: PageEvent) {
    this.pageSize = event.pageSize;
    this.pageIndex = event.pageIndex;
    this._onFilterChange();
  }

  onSortChange(sortState: Sort) {
    this.filterForm.controls.orderBy.setValue(sortState.active);
    this.filterForm.controls.sortDirection.setValue(sortState.direction);
    this._onFilterChange();
  }

  private _onFilterChange() {
    const data = this.filterForm.getRawValue();
    let queryParams = {};

    for (const [formControlName, queryCondition] of Object.entries(
      data.filterConditions
    )) {
      queryParams[formControlName + queryCondition || ''] = data[
        formControlName
      ]
        ? data[formControlName].trim()
        : '';
    }
    queryParams['startTime'] = data.startTime
      ? data.startTime.toISOString()
      : null;
    queryParams['endTime'] = data.endTime ? data.endTime.toISOString() : null;
    queryParams['sortDirection'] = data.sortDirection;
    queryParams['orderBy'] = data.orderBy;
    queryParams['pageIndex'] = this.pageIndex;
    queryParams['pageSize'] = this.pageSize;

    this.router
      .navigate([], {
        relativeTo: this.activatedRoute,
        queryParams,
      })
      .then((r) => {});
  }

  public onExpandElementChange(element: any) {
    this.expandedElementLoanId = element.loanId;
    this.expandedElementCustomerId = element.customerId;
  }

  public onSubmitSearchForm(event) {
    this.filterForm.controls.keyword.setValue(event.keyword);
    this._onFilterChange();
  }

  loanDetailDetectChangeStatusTrigger(event) {
    if (event) {
      this._getLoanList();
    }
  }

  ngOnDestroy(): void {
    // if (this.subManager !== null) {
    // this.subManager.unsubscribe();
    // }
  }
}
