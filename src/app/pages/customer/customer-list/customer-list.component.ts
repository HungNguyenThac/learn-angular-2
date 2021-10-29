import { Component, OnDestroy, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { GlobalConstants } from 'src/app/core/common/global-constants';
import { Store } from '@ngrx/store';
import * as fromActions from '../../../core/store';
import * as fromStore from '../../../core/store';
import {
  DATA_CELL_TYPE,
  DATA_STATUS_TYPE,
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
    title: 'Quản lý khách hàng',
    iconClass: 'sprite-group-5-customer-green-medium',
    searchPlaceholder: 'Họ tên, Mã nhân viên, Số điện thoại, Email...',
    searchable: true,
    showBtnAdd: true,
    btnAddText: 'Thêm nhà cung cấp',
  };

  allColumns: any[] = [
    // {
    //   key: 'id',
    //   title: this.multiLanguageService.instant('customer.individual_info.id'),
    //   type: DATA_CELL_TYPE.TEXT,
    //   format: null,
    // },
    {
      key: 'firstName',
      title: this.multiLanguageService.instant(
        'customer.individual_info.fullname'
      ),
      type: DATA_CELL_TYPE.TEXT,
      format: null,
    },
    {
      key: 'mobileNumber',
      title: this.multiLanguageService.instant(
        'customer.individual_info.phone_number'
      ),
      type: DATA_CELL_TYPE.TEXT,
      format: null,
    },
    {
      key: 'emailAddress',
      title: this.multiLanguageService.instant(
        'customer.individual_info.email'
      ),
      type: DATA_CELL_TYPE.TEXT,
      format: null,
    },
    {
      key: 'paydayLoanStatus',
      title: this.multiLanguageService.instant(
        'customer.individual_info.status'
      ),
      type: DATA_CELL_TYPE.STATUS,
      format: DATA_STATUS_TYPE.PL_UI_STATUS,
    },
    {
      key: 'companyId',
      title: this.multiLanguageService.instant(
        'customer.individual_info.company'
      ),
      type: DATA_CELL_TYPE.TEXT,
      format: null,
    },
    {
      key: 'createdAt',
      title: this.multiLanguageService.instant(
        'customer.individual_info.created_at'
      ),
      type: DATA_CELL_TYPE.DATETIME,
      format: 'dd/MM/yyyy HH:mm',
    },
  ];
  dataSource: MatTableDataSource<any> = new MatTableDataSource([]);
  pages: Array<number>;
  pageSize: number = 5;
  pageIndex: number = 0;
  pageLength: number = 0;
  pageSizeOptions: number[] = [5, 10, 25, 100];
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
      textSearch: [''],
      companyId: [''],
      paydayLoanStatus: [''],
      orderBy: ['createdAt'],
      descending: [true],
      startTime: [''],
      endTime: [''],
      filterConditions: {
        textSearch: QUERY_CONDITION_TYPE.LIKE,
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

    this.filterForm.controls.filterConditions.setValue(filterConditionsValue);
    this.filterForm.controls.orderBy.setValue(params.orderBy || 'createdAt');
    this.filterForm.controls.descending.setValue(params.descending || true);
    this.filterForm.controls.startTime.setValue(params.startTime || '');
    this.filterForm.controls.endTime.setValue(params.endTime || '');
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

  onPageChanged(event: PageEvent) {
    this.pageSize = event.pageSize;
    this.pageIndex = event.pageIndex;
    this._onFilterChange();
  }

  onSortChanged(sortState: Sort) {
    this.filterForm.controls.orderBy.setValue(sortState.active);
    this.filterForm.controls.descending.setValue(sortState.direction);
    this._onFilterChange();
  }

  onExpandElementChange(element: any) {
    this.expandedElementId = element.id
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
    queryParams['pageIndex'] = this.pageIndex;
    queryParams['pageSize'] = this.pageSize;

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
