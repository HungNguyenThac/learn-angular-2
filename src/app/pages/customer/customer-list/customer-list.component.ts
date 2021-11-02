import { Component, OnDestroy, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { GlobalConstants } from 'src/app/core/common/global-constants';
import { Store } from '@ngrx/store';
import * as fromActions from '../../../core/store';
import * as fromStore from '../../../core/store';
import {
  DATA_CELL_TYPE,
  DATA_STATUS_TYPE,
  FILTER_TYPE,
  NAV_ITEM,
  QUERY_CONDITION_TYPE,
} from '../../../core/common/enum/operator';
import { MultiLanguageService } from '../../../share/translate/multiLanguageService';
import { Observable, Subscription } from 'rxjs';
import {
  ApiResponseSearchAndPaginationResponseCompanyInfo,
  ApiResponseSearchAndPaginationResponseCustomerInfo,
  CompanyControllerService,
  SearchAndPaginationResponseCompanyInfo,
} from '../../../../../open-api-modules/dashboard-api-docs';
import { CustomerListService } from './customer-list.service';
import { MatTableDataSource } from '@angular/material/table';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import * as fromSelectors from '../../../core/store/selectors';
import { BreadcrumbOptionsModel } from '../../../public/models/breadcrumb-options.model';
import { PageEvent } from '@angular/material/paginator/public-api';
import { Sort } from '@angular/material/sort';
import { FilterOptionModel } from 'src/app/public/models/filter-option.model';
import { FilterSubItemsModel } from '../../../public/models/filter-sub-items.model';
import { FilterEventModel } from '../../../public/models/filter-event.model';
import { FilterActionEventModel } from '../../../public/models/filter-action-event.model';

@Component({
  selector: 'app-customer-list',
  templateUrl: './customer-list.component.html',
  styleUrls: ['./customer-list.component.scss'],
})
export class CustomerListComponent implements OnInit, OnDestroy {
  companyList: SearchAndPaginationResponseCompanyInfo;
  subManager = new Subscription();

  tableTitle: string = this.multiLanguageService.instant(
    'page_title.customer_list'
  );
  breadcrumbOptions: BreadcrumbOptionsModel = {
    title: this.multiLanguageService.instant('breadcrumb.manage_customer'),
    iconClass: 'sprite-group-5-customer-green-medium',
    searchPlaceholder: 'Họ tên, Mã nhân viên, Số điện thoại, Email...',
    searchable: true,
    showBtnAdd: false,
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
      title: this.multiLanguageService.instant('filter.time'),
      type: FILTER_TYPE.SELECT,
      controlName: 'companyId',
      value: null,
      titleAction: 'áda',
      actionIconClass: 'sprite-group-5-home-white',
      showAction: true,
      options: [
        {
          title: 'adas',
          value: 'ádas',
          showAction: true,
          actionTitle: 'ádas',
          actionIconClass: 'sprite-group-5-home-white',
          disabled: false,
          count: 10,
        },
        {
          title: 'vcasvsa',
          value: 'váva',
          showAction: true,
          actionTitle: 'vvasva',
          actionIconClass: 'sprite-group-5-home-white',
          subTitle: 'váv',
          disabled: false,
          count: 10,
        },
      ],
    },
    {
      title: this.multiLanguageService.instant('filter.time'),
      type: FILTER_TYPE.SELECT,
      controlName: 'paydayLoanStatus',
      value: null,
      options: [
        {
          title: 'adas',
          value: 'ádas',
          showAction: true,
          actionTitle: 'ádas',
          actionIconClass: 'sprite-group-5-home-white',
          subTitle: 'ádas',
          subOptions: [
            {
              title: 'ádas',
              value: 'ádfa',
              selected: true,
              imgSrc: 'assets/img/icon/group-5/pl-24-available.png',
              showAction: true,
            },
          ],
          disabled: false,
          count: 0,
        },
        {
          title: 'vcasvsa',
          value: 'váva',
          showAction: true,
          actionTitle: 'vvasva',
          actionIconClass: 'sprite-group-5-home-white',
          subTitle: 'váv',
          subOptions: [
            {
              title: 'ádas',
              value: 'ádfa',
              selected: true,
              imgSrc: 'assets/img/icon/group-5/pl-24-available.png',
              showAction: true,
            },
          ],
          disabled: false,
          count: 10,
        },
      ],
    },
    {
      title: this.multiLanguageService.instant('filter.time'),
      type: FILTER_TYPE.MULTIPLE_CHOICE,
      controlName: 'companyId',
      value: null,
      showAction: true,
      titleAction: 'them moi ',
      actionIconClass: 'sprite-group-5-home',
      options: [
        {
          title: 'cvas',
          value: 'avs',
          showAction: true,
          actionTitle: 'Toi la day',
          actionIconClass: 'sprite-group-5-coin',
          subTitle: 'casca',
          disabled: false,
          count: 0,
        },
        {
          title: 'vcasvsa',
          value: 'váva',
          showAction: false,
          actionTitle: 'DDay la toi',
          actionIconClass: 'sprite-group-5-coin',
          subTitle: 'váv',
          disabled: false,
          count: 0,
        },
      ],
    },
  ];

  allColumns: any[] = [
    {
      key: 'id',
      title: this.multiLanguageService.instant('customer.individual_info.id'),
      type: DATA_CELL_TYPE.TEXT,
      format: null,
      showed: false,
    },
    {
      key: 'firstName',
      title: this.multiLanguageService.instant(
        'customer.individual_info.fullname'
      ),
      type: DATA_CELL_TYPE.TEXT,
      format: null,
      showed: true,
    },
    {
      key: 'mobileNumber',
      title: this.multiLanguageService.instant(
        'customer.individual_info.phone_number'
      ),
      type: DATA_CELL_TYPE.TEXT,
      format: null,
      showed: true,
    },
    {
      key: 'emailAddress',
      title: this.multiLanguageService.instant(
        'customer.individual_info.email'
      ),
      type: DATA_CELL_TYPE.TEXT,
      format: null,
      showed: true,
    },
    {
      key: 'dateOfBirth',
      title: this.multiLanguageService.instant(
        'customer.individual_info.date_of_birth'
      ),
      type: DATA_CELL_TYPE.TEXT,
      format: null,
      showed: false,
    },
    {
      key: 'gender',
      title: this.multiLanguageService.instant(
        'customer.individual_info.gender'
      ),
      type: DATA_CELL_TYPE.TEXT,
      format: null,
      showed: false,
    },
    {
      key: 'addressTwoLine1',
      title: this.multiLanguageService.instant(
        'customer.individual_info.permanent_address'
      ),
      type: DATA_CELL_TYPE.TEXT,
      format: null,
      showed: false,
    },
    {
      key: 'addressTwoLine2',
      title: this.multiLanguageService.instant(
        'customer.individual_info.current_residence'
      ),
      type: DATA_CELL_TYPE.TEXT,
      format: null,
      showed: false,
    },
    {
      key: 'identityNumberOne',
      title: this.multiLanguageService.instant(
        'customer.individual_info.id_number'
      ),
      type: DATA_CELL_TYPE.TEXT,
      format: null,
      showed: false,
    },
    {
      key: 'paydayLoanStatus',
      title: this.multiLanguageService.instant(
        'customer.individual_info.status'
      ),
      type: DATA_CELL_TYPE.STATUS,
      format: DATA_STATUS_TYPE.PL_UI_STATUS,
      showed: true,
    },
    {
      key: 'companyId',
      title: this.multiLanguageService.instant(
        'customer.individual_info.company'
      ),
      type: DATA_CELL_TYPE.TEXT,
      format: null,
      showed: true,
    },
    {
      key: 'organizationName',
      title: this.multiLanguageService.instant(
        'customer.individual_info.employee_code'
      ),
      type: DATA_CELL_TYPE.TEXT,
      format: null,
      showed: true,
    },
    {
      key: 'createdAt',
      title: this.multiLanguageService.instant(
        'customer.individual_info.created_at'
      ),
      type: DATA_CELL_TYPE.DATETIME,
      format: 'dd/MM/yyyy HH:mm',
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
  expandedElementId: string;
  private readonly routeAllState$: Observable<Params>;

  constructor(
    private titleService: Title,
    private store: Store<fromStore.State>,
    private multiLanguageService: MultiLanguageService,
    private customerListService: CustomerListService,
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
      this.multiLanguageService.instant('page_title.customer_list') +
        ' - ' +
        GlobalConstants.PL_VALUE_DEFAULT.PROJECT_NAME
    );
    this.store.dispatch(new fromActions.SetOperatorInfo(NAV_ITEM.CUSTOMER));
    this._initSubscription();
  }

  private _initFilterForm() {
    this.filterForm = this.formBuilder.group({
      keyword: [''],
      companyId: [''],
      paydayLoanStatus: [''],
      orderBy: ['createdAt'],
      sortDirection: ['desc'],
      startTime: [''],
      endTime: [''],
      filterConditions: {
        companyId: QUERY_CONDITION_TYPE.EQUAL,
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
        this._getCustomerList();
        this._getCompanyList();
      })
    );
  }

  private _getCustomerList() {
    const params = this._buildParams();
    this.subManager.add(
      this.customerListService
        .getData(params)
        .subscribe(
          (data: ApiResponseSearchAndPaginationResponseCustomerInfo) => {
            this._parseData(data?.result);
          }
        )
    );
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
    data.limit = this.pageSize;
    data.pageIndex = this.pageIndex;
    return data;
  }

  private _parseData(rawData) {
    this.pageLength = rawData?.pagination?.maxPage || 0;
    this.totalItems = rawData?.pagination?.total || 0;
    this.dataSource.data = rawData?.data || [];
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
    this.expandedElementId = element.id;
  }

  public onSubmitSearchForm(event) {
    this.filterForm.controls.keyword.setValue(event.keyword);
    this._onFilterChange();
  }

  public onFilterChange(event: FilterEventModel) {
    console.log('FilterEventModel', event);
  }

  public onFilterActionTrigger(event: FilterActionEventModel) {
    console.log('FilterActionEventModel', event);
  }

  private _onFilterChange() {
    const data = this.filterForm.getRawValue();
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
    queryParams['startTime'] = data.startTime
      ? data.startTime.toISOString()
      : null;
    queryParams['endTime'] = data.endTime ? data.endTime.toISOString() : null;

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

  ngOnDestroy(): void {
    if (this.subManager !== null) {
      // this.subManager.unsubscribe();
    }
  }
}
