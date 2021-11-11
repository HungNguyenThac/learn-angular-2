import { SearchAndPaginationResponsePaydayLoanHmg } from './../../../../../../open-api-modules/dashboard-api-docs/model/searchAndPaginationResponsePaydayLoanHmg';
import { FilterActionEventModel } from './../../../../public/models/filter/filter-action-event.model';
import { FilterEventModel } from './../../../../public/models/filter/filter-event.model';
import { CompanyInfo } from './../../../../../../open-api-modules/customer-api-docs/model/companyInfo';
import {
  PAYDAY_LOAN_UI_STATUS_TEXT,
  PAYDAY_LOAN_STATUS,
} from './../../../../core/common/enum/payday-loan';
import { FILTER_TYPE } from 'src/app/core/common/enum/operator';
import { LoanListService } from './loan-list.service';
import { PageEvent } from '@angular/material/paginator/public-api';
import { Sort } from '@angular/material/sort';
import {
  ApiResponseSearchAndPaginationResponseCompanyInfo,
  ApiResponseSearchAndPaginationResponsePaydayLoanHmg,
  ApiResponseSearchAndPaginationResponsePaydayLoanTng,
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
import { FilterOptionModel } from 'src/app/public/models/filter/filter-option.model';

@Component({
  selector: 'app-loan-list',
  templateUrl: './loan-list.component.html',
  styleUrls: ['./loan-list.component.scss'],
})
export class LoanListComponent implements OnInit {
  companyList: Array<CompanyInfo>;
  subManager = new Subscription();
  tableTitle: string = this.multiLanguageService.instant(
    'page_title.loan_list'
  );
  breadcrumbOptions: BreadcrumbOptionsModel = {
    title: 'Vay ứng lương - HMG',
    iconImgSrc: 'assets/img/icon/group-5/pl-24-available.png',
    searchPlaceholder: 'Mã khoản vay, Số điện thoại...',
    searchable: true,
    showBtnAdd: false,
    // btnAddText: 'Thêm nhà cung cấp',
    keyword: '',
  };

  filterOptions = [
    {
      title: this.multiLanguageService.instant('filter.time'),
      type: FILTER_TYPE.DATETIME,
      controlName: 'createdAt',
      value: null,
    },
    {
      title: this.multiLanguageService.instant('filter.company'),
      type: FILTER_TYPE.SELECT,
      controlName: 'companyId',
      value: null,
      options: [
        {
          title: this.multiLanguageService.instant('filter.choose_company'),
          value: null,
          showAction: false,
          subTitle: this.multiLanguageService.instant('filter.choose_company'),
          subOptions: [],
          disabled: false,
          count: 0,
        },
      ],
    },
    {
      title: this.multiLanguageService.instant('filter.loan_status'),
      type: FILTER_TYPE.SELECT,
      controlName: 'status',
      value: null,
      multiple: true,
      options: [
        {
          title: this.multiLanguageService.instant('common.all'),
          value: null,
        },
        {
          title: this.multiLanguageService.instant(
            'loan_app.loan_info.initialized'
          ),
          value: PAYDAY_LOAN_STATUS.INITIALIZED,
        },
        {
          title: this.multiLanguageService.instant(
            'loan_app.loan_info.document_awaiting'
          ),
          value: PAYDAY_LOAN_STATUS.DOCUMENT_AWAITING,
        },
        {
          title: this.multiLanguageService.instant(
            'payday_loan.status.documentation_complete'
          ),
          value: PAYDAY_LOAN_STATUS.DOCUMENTATION_COMPLETE,
        },
        {
          title: this.multiLanguageService.instant(
            'loan_app.loan_info.auction'
          ),
          value: PAYDAY_LOAN_STATUS.AUCTION,
        },
        {
          title: this.multiLanguageService.instant('payday_loan.status.funded'),
          value: PAYDAY_LOAN_STATUS.FUNDED,
        },
        {
          title: this.multiLanguageService.instant(
            'loan_app.loan_info.disbursement_awaiting'
          ),
          value: PAYDAY_LOAN_STATUS.AWAITING_DISBURSEMENT,
        },
        {
          title: this.multiLanguageService.instant(
            'loan_app.loan_info.disbursed'
          ),
          value: PAYDAY_LOAN_STATUS.DISBURSED,
        },
        {
          title: this.multiLanguageService.instant(
            'loan_app.loan_info.ỉn_repayment'
          ),
          value: PAYDAY_LOAN_STATUS.IN_REPAYMENT,
        },
        {
          title: this.multiLanguageService.instant(
            'loan_app.loan_info.completed'
          ),
          value: PAYDAY_LOAN_STATUS.COMPLETED,
        },
        {
          title: this.multiLanguageService.instant(
            'loan_app.loan_info.rejected'
          ),
          value: PAYDAY_LOAN_STATUS.REJECTED,
        },
        {
          title: this.multiLanguageService.instant(
            'loan_app.loan_info.withdrew'
          ),
          value: PAYDAY_LOAN_STATUS.WITHDRAW,
        },
      ],
    },
  ];

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
      key: 'customerMobileNumber',
      title: this.multiLanguageService.instant(
        'loan_app.loan_info.phone_number'
      ),
      type: DATA_CELL_TYPE.TEXT,
      format: null,
      showed: true,
    },
    {
      key: 'expectedTenure',
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

  detectUpdateLoanAfterSign() {
    // this._getLoanList();
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

  public onExpandElementChange(element: any) {
    console.log('---------------------------element', element);

    this.expandedElementLoanId = element.id;
    this.expandedElementCustomerId = element.customerId;
  }

  public onSubmitSearchForm(event) {
    this.filterForm.controls.keyword.setValue(event.keyword);
    this._onFilterChange();
  }

  loanDetailDetectChangeStatusTrigger(event) {
    // if (event) {
    //   this._getLoanList();
    // }
  }

  public onFilterFormChange(event: FilterEventModel) {
    switch (event.type) {
      case FILTER_TYPE.DATETIME:
        this.filterForm.controls.startTime.setValue(event.value.startDate);
        this.filterForm.controls.endTime.setValue(event.value.endDate);
        this.filterForm.controls.dateFilterType.setValue(event.value.type);
        this.filterForm.controls.dateFilterTitle.setValue(event.value.title);
        break;
      case FILTER_TYPE.MULTIPLE_CHOICE:
        break;
      case FILTER_TYPE.SELECT:
        if (event.controlName === 'companyId') {
          this.filterForm.controls.companyId.setValue(
            event.value ? event.value.join(',') : ''
          );
        } else if (event.controlName === 'status') {
          this.filterForm.controls.status.setValue(
            event.value ? event.value.join(',') : ''
          );
        }
        break;
      default:
        break;
    }

    this._onFilterChange();
  }

  public onFilterActionTrigger(event: FilterActionEventModel) {
    console.log('FilterActionEventModel', event);
  }

  ngOnDestroy(): void {
    // if (this.subManager !== null) {
    // this.subManager.unsubscribe();
    // }
  }

  private _initFilterForm() {
    this.filterForm = this.formBuilder.group({
      keyword: [''],
      companyId: [''],
      groupName: [''],
      loanCode: [''],
      customerMobileNumber: [''],
      status: [''],
      officeCode: [''],
      identityNumberOne: [''],
      orderBy: ['createdAt'],
      sortDirection: ['desc'],
      startTime: [''],
      endTime: [''],
      dateFilterType: [''],
      dateFilterTitle: [''],
      filterConditions: {
        // keyword: QUERY_CONDITION_TYPE.LIKE,
        companyId: QUERY_CONDITION_TYPE.IN,
        status: QUERY_CONDITION_TYPE.IN,
        // loanCode: QUERY_CONDITION_TYPE.LIKE,
        // customerMobileNumber: QUERY_CONDITION_TYPE.LIKE,
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

    this.filterForm.controls.filterConditions.setValue(filterConditionsValue);

    this.filterOptions.forEach((filterOption) => {
      if (filterOption.type === FILTER_TYPE.DATETIME) {
        filterOption.value = {
          type: params.dateFilterType,
          title: params.dateFilterTitle,
        };
      } else if (filterOption.controlName === 'companyId') {
        filterOption.value = this.filterForm.controls.companyId.value
          ? this.filterForm.controls.companyId.value.split(',')
          : [];
      } else if (filterOption.controlName === 'status') {
        filterOption.value = this.filterForm.controls.status.value;
      }
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
    if (params.groupName === 'HMG') {
      this.subManager.add(
        this.loanListService
          .getLoanDataHmg(params)
          .subscribe(
            (data: ApiResponseSearchAndPaginationResponsePaydayLoanHmg) => {
              this._parseData(data?.result);
            }
          )
      );
    }

    if (params.groupName === 'TNG') {
      this.subManager.add(
        this.loanListService
          .getLoanDataTng(params)
          .subscribe(
            (data: ApiResponseSearchAndPaginationResponsePaydayLoanTng) => {
              this._parseData(data?.result);
            }
          )
      );
    }
  }

  private _getCompanyList() {
    this.subManager.add(
      this.companyControllerService
        .getCompanies(10, 0, {})
        .subscribe(
          (data: ApiResponseSearchAndPaginationResponseCompanyInfo) => {
            this.companyList = data?.result?.data;
            this._initCompanyOptions();
          }
        )
    );
  }

  private _initCompanyOptions() {
    this.filterOptions.forEach((filterOption: FilterOptionModel) => {
      if (filterOption.controlName !== 'companyId') {
        return;
      }
      filterOption.options[0].subOptions = this.companyList?.map(
        (company: CompanyInfo) => {
          return {
            title: company.name + ' (' + company.code + ')',
            value: company.id,
            imgSrc: company.avatar,
            code: company.code,
          };
        }
      );
    });
  }

  private _buildParams() {
    const data = this.filterForm.getRawValue();
    data.offset = this.pageIndex * this.pageSize;
    data.pageSize = this.pageSize;
    data.pageNumber = this.pageIndex;
    return data;
  }

  private _parseData(rawData: SearchAndPaginationResponsePaydayLoanHmg) {
    this.pageLength = rawData?.pagination?.maxPage || 0;
    this.totalItems = rawData?.pagination?.total || 0;
    this.dataSource.data = rawData?.data || [];
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

    queryParams['startTime'] = data.startTime;
    queryParams['endTime'] = data.endTime;
    queryParams['dateFilterType'] = data.dateFilterType;
    queryParams['dateFilterTitle'] = data.dateFilterTitle;

    queryParams['groupName'] = data.groupName;
    queryParams['orderBy'] = data.orderBy;
    queryParams['sortDirection'] = data.sortDirection;
    queryParams['pageIndex'] = this.pageIndex;
    queryParams['pageSize'] = this.pageSize;
    queryParams['keyword'] = data.keyword;

    this.router
      .navigate([], {
        relativeTo: this.activatedRoute,
        queryParams,
      })
      .then((r) => {});
  }
}
