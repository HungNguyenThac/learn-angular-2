import { Component, OnDestroy, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { GlobalConstants } from 'src/app/core/common/global-constants';
import { Store } from '@ngrx/store';
import * as fromActions from '../../../../core/store';
import * as fromStore from '../../../../core/store';
import {
  DATA_CELL_TYPE,
  DATA_STATUS_TYPE,
  FILTER_TYPE,
  NAV_ITEM,
  QUERY_CONDITION_TYPE,
} from '../../../../core/common/enum/operator';
import { MultiLanguageService } from '../../../../share/translate/multiLanguageService';
import { Observable, Subscription } from 'rxjs';
import {
  ApiResponseSearchAndPaginationResponseCompanyInfo,
  ApiResponseSearchAndPaginationResponseCustomerInfo,
  CompanyControllerService,
  CompanyInfo,
} from '../../../../../../open-api-modules/dashboard-api-docs';
import { MatTableDataSource } from '@angular/material/table';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import * as fromSelectors from '../../../../core/store/selectors';
import { BreadcrumbOptionsModel } from '../../../../public/models/external/breadcrumb-options.model';
import { PageEvent } from '@angular/material/paginator/public-api';
import { Sort } from '@angular/material/sort';
import { FilterOptionModel } from 'src/app/public/models/filter/filter-option.model';
import { FilterEventModel } from '../../../../public/models/filter/filter-event.model';
import { FilterActionEventModel } from '../../../../public/models/filter/filter-action-event.model';
import {
  PAYDAY_LOAN_UI_STATUS,
  PAYDAY_LOAN_UI_STATUS_TEXT,
} from '../../../../core/common/enum/payday-loan';

export interface UserListResult {
  id: number;
  username: string;
  userAccount: string;
  email: string;
  phone: string;
  note: string;
  role: string;
  status: string;
}

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss'],
})
export class UserListComponent implements OnInit, OnDestroy {
  //Mock data
  userList: UserListResult[] = [
    {
      id: 1,
      username: 'Bùi Minh',
      userAccount: 'minhdungdau',
      email: 'minh.bui@epay.vn',
      phone: '0982737261',
      note: '',
      role: 'Dev',
      status: this.multiLanguageService.instant('common.active'),
    },
    {
      id: 2,
      username: 'Nguyễn Tiến Đạt',
      userAccount: 'datnguyen',
      email: 'dat.nguyen@epay.vn',
      phone: '09828371629',
      note: '',
      role: 'Dev',
      status: this.multiLanguageService.instant('common.active'),
    },
    {
      id: 3,
      username: 'Tạ Minh Quân',
      userAccount: 'quanta',
      email: 'quan.ta@epay.vn',
      phone: '0934475006',
      note: '',
      role: 'Dev',
      status: this.multiLanguageService.instant('common.inactive'),
    },
  ];
  companyList: Array<CompanyInfo>;
  subManager = new Subscription();
  tableTitle: string = this.multiLanguageService.instant(
    'page_title.user_list'
  );
  breadcrumbOptions: BreadcrumbOptionsModel = {
    title: this.multiLanguageService.instant('breadcrumb.manage_user'),
    iconImgSrc: 'assets/img/icon/group-5/person-roll.svg',
    searchPlaceholder: 'Tên đăng nhập, tên người dùng',
    searchable: true,
    showBtnAdd: true,
    btnAddText: this.multiLanguageService.instant('system.add_user'),
    keyword: '',
  };
  filterOptions: FilterOptionModel[] = [
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
      title: this.multiLanguageService.instant('filter.pl_ui_status'),
      type: FILTER_TYPE.SELECT,
      controlName: 'paydayLoanStatus',
      value: null,
      options: [
        {
          title: this.multiLanguageService.instant('common.all'),
          value: null,
        },
        {
          title: this.multiLanguageService.instant(
            PAYDAY_LOAN_UI_STATUS_TEXT.NOT_COMPLETE_EKYC_YET
          ),
          value: PAYDAY_LOAN_UI_STATUS.NOT_COMPLETE_EKYC_YET,
        },
        {
          title: this.multiLanguageService.instant(
            PAYDAY_LOAN_UI_STATUS_TEXT.NOT_COMPLETE_FILL_EKYC_YET
          ),
          value: PAYDAY_LOAN_UI_STATUS.NOT_COMPLETE_FILL_EKYC_YET,
        },
        {
          title: this.multiLanguageService.instant(
            PAYDAY_LOAN_UI_STATUS_TEXT.NOT_ACCEPTING_TERM_YET
          ),
          value: PAYDAY_LOAN_UI_STATUS.NOT_ACCEPTING_TERM_YET,
        },
        {
          title: this.multiLanguageService.instant(
            PAYDAY_LOAN_UI_STATUS_TEXT.NOT_COMPLETE_CDE_YET
          ),
          value: PAYDAY_LOAN_UI_STATUS.NOT_COMPLETE_CDE_YET,
        },
        {
          title: this.multiLanguageService.instant(
            PAYDAY_LOAN_UI_STATUS_TEXT.COMPLETED_CDE
          ),
          value: PAYDAY_LOAN_UI_STATUS.COMPLETED_CDE,
        },
      ],
    },
    {
      title: this.multiLanguageService.instant('filter.account_status'),
      type: FILTER_TYPE.SELECT,
      controlName: 'unknow',
      value: null,
      options: [
        {
          title: this.multiLanguageService.instant('common.all'),
          value: null,
        },
        {
          title: this.multiLanguageService.instant('common.active'),
          value: PAYDAY_LOAN_UI_STATUS.NOT_COMPLETE_EKYC_YET,
        },
        {
          title: this.multiLanguageService.instant('common.inactive'),
          value: PAYDAY_LOAN_UI_STATUS.NOT_COMPLETE_FILL_EKYC_YET,
        },
      ],
    },
  ];
  allColumns: any[] = [
    {
      key: 'userAccount',
      title: this.multiLanguageService.instant(
        'system.system_management.user_account'
      ),
      type: DATA_CELL_TYPE.TEXT,
      format: null,
      showed: true,
    },
    {
      key: 'username',
      title: this.multiLanguageService.instant(
        'system.system_management.username'
      ),
      type: DATA_CELL_TYPE.TEXT,
      format: null,
      showed: true,
    },
    {
      key: 'role',
      title: this.multiLanguageService.instant('system.system_management.role'),
      type: DATA_CELL_TYPE.STATUS,
      format: null,
      showed: true,
    },
    {
      key: 'status',
      title: this.multiLanguageService.instant(
        'system.system_management.status'
      ),
      type: DATA_CELL_TYPE.STATUS,
      format: DATA_STATUS_TYPE.PL_OTHER_STATUS,
      showed: true,
    },
  ];
  dataSource: MatTableDataSource<any> = new MatTableDataSource([]);
  pages: Array<number>;
  pageSize: number = 10;
  pageIndex: number = 0;
  pageLength: number = 0;
  pageSizeOptions: number[] = [10, 20, 50];
  totalItems: number = 0;
  filterForm: FormGroup;
  expandedElementId: number;
  userInfo;
  private readonly routeAllState$: Observable<Params>;

  constructor(
    private titleService: Title,
    private store: Store<fromStore.State>,
    private multiLanguageService: MultiLanguageService,
    private companyControllerService: CompanyControllerService,
    private formBuilder: FormBuilder,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {
    this.routeAllState$ = store.select(fromSelectors.getRouterAllState);
    this._initFilterForm();
  }

  ngOnInit(): void {
    this.titleService.setTitle(
      this.multiLanguageService.instant('page_title.user_list') +
        ' - ' +
        GlobalConstants.PL_VALUE_DEFAULT.PROJECT_NAME
    );
    this.store.dispatch(new fromActions.SetOperatorInfo(NAV_ITEM.CUSTOMER));
    this._initSubscription();
    this.dataSource.data = this.userList;
  }

  public onPageChange(event: PageEvent) {
    this.pageSize = event.pageSize;
    this.pageIndex = event.pageIndex;
    this._onFilterChange();
  }

  public onSortChange(sortState: Sort) {
    this.filterForm.controls.orderBy.setValue(sortState.active);
    this.filterForm.controls.sortDirection.setValue(sortState.direction);
    this._onFilterChange();
  }

  public onExpandElementChange(element: any) {
    console.log(element.id);
    this.expandedElementId = element.id;
    this.userInfo = this.userList.filter((user) => user.id === element.id)[0];
  }

  public onSubmitSearchForm(event) {
    this.filterForm.controls.keyword.setValue(event.keyword);
    this._onFilterChange();
  }

  public onFilterFormChange(event: FilterEventModel) {
    console.log('FilterEventModel', event);
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
        } else if (event.controlName === 'paydayLoanStatus') {
          this.filterForm.controls.paydayLoanStatus.setValue(event.value);
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
    if (this.subManager !== null) {
      // this.subManager.unsubscribe();
    }
  }

  private _initFilterForm() {
    this.filterForm = this.formBuilder.group({
      keyword: [''],
      companyId: [''],
      paydayLoanStatus: [''],
      orderBy: ['createdAt'],
      sortDirection: ['desc'],
      startTime: [null],
      endTime: [null],
      dateFilterType: [''],
      dateFilterTitle: [''],
      filterConditions: {
        companyId: QUERY_CONDITION_TYPE.IN,
        paydayLoanStatus: QUERY_CONDITION_TYPE.EQUAL,
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
      } else if (filterOption.controlName === 'paydayLoanStatus') {
        filterOption.value = this.filterForm.controls.paydayLoanStatus.value;
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
        this._getCompanyList();
      })
    );
  }

  private _getCompanyList() {
    this.subManager.add(
      this.companyControllerService
        .getCompanies(100, 0, {})
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
      filterOption.options[0].subOptions = this.companyList.map(
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
    data.limit = this.pageSize;
    data.pageIndex = this.pageIndex;
    return data;
  }

  private _parseData(rawData) {
    this.pageLength = rawData?.pagination?.maxPage || 0;
    this.totalItems = rawData?.pagination?.total || 0;
    this.dataSource.data = rawData?.data || [];
  }

  private _onFilterChange() {
    const data = this.filterForm.getRawValue();
    console.log('_onFilterChange', data);
    //convert time to ISO and set end time
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
