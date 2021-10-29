import { LoanListService } from './loan-list.service';
import { PageEvent } from '@angular/material/paginator/public-api';
import { Sort } from '@angular/material/sort';
import { ApiResponseSearchAndPaginationResponseCompanyInfo } from './../../../../../../open-api-modules/dashboard-api-docs/model/apiResponseSearchAndPaginationResponseCompanyInfo';
import { CustomerListService } from './../../../customer/customer-list/customer-list.service';
import { CompanyControllerService } from './../../../../../../open-api-modules/dashboard-api-docs/api/companyController.service';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { BreadcrumbOptionsModel } from './../../../../public/models/breadcrumb-options.model';
import { Subscription, Observable } from 'rxjs';
import { SearchAndPaginationResponseCompanyInfo } from './../../../../../../open-api-modules/dashboard-api-docs/model/searchAndPaginationResponseCompanyInfo';
import { DATA_CELL_TYPE, DATA_STATUS_TYPE, QUERY_CONDITION_TYPE } from './../../../../core/common/enum/operator';
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
import { ApiResponseSearchPaydayLoanResponse } from 'open-api-modules/dashboard-api-docs';
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
    },
    {
      key: 'status',
      title: this.multiLanguageService.instant('loan_app.loan_info.status'),
      type: DATA_CELL_TYPE.STATUS,
      format: DATA_STATUS_TYPE.PL_UI_STATUS,
    },
    {
      key: 'customerName',
      title: this.multiLanguageService.instant('loan_app.loan_info.customer'),
      type: DATA_CELL_TYPE.TEXT,
      format: null,
    },
    {
      key: 'mobileNumber',
      title: this.multiLanguageService.instant(
        'loan_app.loan_info.phone_number'
      ),
      type: DATA_CELL_TYPE.TEXT,
      format: null,
    },
    {
      key: 'tenure',
      title: this.multiLanguageService.instant('loan_app.loan_info.loan_term'),
      type: DATA_CELL_TYPE.TEXT,
      format: null,
    },
    {
      key: 'createdAt',
      title: this.multiLanguageService.instant(
        'loan_app.loan_info.register_at'
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
      textSearch: [''],
      companyId: [''],
      loanCode: [''],
      mobileNumber: [''],
      status: [''],
      orderBy: ['createdAt'],
      descending: [true],
      startTime: [''],
      endTime: [''],
      filterConditions: {
        textSearch: QUERY_CONDITION_TYPE.LIKE,
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
        this._getLoanList();
        this._getCompanyList();
      })
    );
  }

  private _getLoanList() {
    const params = this._buildParams();
    this.subManager.add(
      this.loanListService
        .getLoanDataHmg(params)
        .subscribe((data: ApiResponseSearchPaydayLoanResponse) => {
          this._parseData(data?.result);
        })
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
    data.pageSize = this.pageSize;
    data.pageNumber = this.pageIndex;
    return data;
  }

  private _parseData(rawData) {
    this.pageLength = rawData?.pagination?.maxPage || 0;
    this.totalItems = rawData?.pagination?.total || 0;
    this.dataSource.data = rawData?.searchPaydayLoanResult || [];
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
    // if (this.subManager !== null) {
    // this.subManager.unsubscribe();
    // }
  }
}
