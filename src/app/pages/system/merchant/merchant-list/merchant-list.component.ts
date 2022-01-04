import {Component, OnInit, ViewChild} from '@angular/core';
import {Store} from '@ngrx/store';
import * as fromActions from '../../../../core/store';
import * as fromStore from '../../../../core/store';
import {TableSelectActionModel} from '../../../../public/models/external/table-select-action.model';
import {MultiLanguageService} from '../../../../share/translate/multiLanguageService';
import {NotificationService} from '../../../../core/services/notification.service';
import {ToastrService} from 'ngx-toastr';
import {FormBuilder, FormGroup} from '@angular/forms';
import {Sort} from '@angular/material/sort';
import {FilterEventModel} from '../../../../public/models/filter/filter-event.model';
import * as _ from 'lodash';
import {
  BUTTON_TYPE,
  DATA_CELL_TYPE,
  DATA_STATUS_TYPE,
  FILTER_TYPE,
  NAV_ITEM,
  QUERY_CONDITION_TYPE,
  RESPONSE_CODE,
} from '../../../../core/common/enum/operator';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {FilterOptionModel} from '../../../../public/models/filter/filter-option.model';
import {
  PAYDAY_LOAN_UI_STATUS,
  PAYDAY_LOAN_UI_STATUS_TEXT,
} from '../../../../core/common/enum/payday-loan';
import {BreadcrumbOptionsModel} from '../../../../public/models/external/breadcrumb-options.model';
import {MatTableDataSource} from '@angular/material/table';
import {PageEvent} from '@angular/material/paginator/public-api';
import {FilterActionEventModel} from '../../../../public/models/filter/filter-action-event.model';
import {
  AddNewUserDialogComponent,
  BaseManagementLayoutComponent,
} from '../../../../share/components';
import {MatDialog} from '@angular/material/dialog';
import {MerchantDetailDialogComponent} from '../../../../share/components';
import {MerchantGroupDialogComponent} from '../../../../share/components';
import {GlobalConstants} from '../../../../core/common/global-constants';
import {Title} from '@angular/platform-browser';
import {DisplayedFieldsModel} from '../../../../public/models/filter/displayed-fields.model';
import {
  ApiResponseSearchAndPaginationResponseAdminAccountEntity,
  ApiResponseSearchAndPaginationResponseCompanyInfo,
  ApiResponseSearchAndPaginationResponseMerchant,
  CompanyInfo,
} from '../../../../../../open-api-modules/dashboard-api-docs';
import {
  AdminControllerService,
  ApiResponseListMerchant,
  ApiResponseMerchant,
  ApiResponseString,
  CreateMerchantRequestDto,
  MerchantControllerService,
} from '../../../../../../open-api-modules/merchant-api-docs';
import {Observable, Subscription} from 'rxjs';
import {MerchantListService} from './merchant-list.service';
import {ApiResponse} from '../../../../../../open-api-modules/monexcore-api-docs';
import {ApiResponseAdminAccountEntity} from '../../../../../../open-api-modules/identity-api-docs';
import * as fromSelectors from '../../../../core/store/selectors';

@Component({
  selector: 'app-merchant-list',
  templateUrl: './merchant-list.component.html',
  styleUrls: ['./merchant-list.component.scss'],
})
export class MerchantListComponent implements OnInit {
  bdList = [
    {
      name: 'BD1',
      id: '1',
    },
    {
      name: 'BD2',
      id: '2',
    },
    {
      name: 'BD3',
      id: '3',
    },
  ];

  productList = [
    {
      name: 'Thời trang',
      id: '1',
    },
    {
      name: 'Thực phẩm',
      id: '2',
    },
    {
      name: 'Điện tử',
      id: '3',
    },
  ];

  allColumns: DisplayedFieldsModel[] = [
    {
      key: 'code',
      title: this.multiLanguageService.instant('merchant.merchant_list.id'),
      type: DATA_CELL_TYPE.TEXT,
      format: null,
      showed: true,
    },
    {
      key: 'name',
      title: this.multiLanguageService.instant('merchant.merchant_list.name'),
      type: DATA_CELL_TYPE.TEXT,
      format: null,
      showed: true,
    },
    {
      key: 'mobile',
      title: this.multiLanguageService.instant('merchant.merchant_list.phone'),
      type: DATA_CELL_TYPE.TEXT,
      format: null,
      showed: true,
    },
    {
      key: 'email',
      title: this.multiLanguageService.instant('merchant.merchant_list.email'),
      type: DATA_CELL_TYPE.TEXT,
      format: null,
      showed: true,
    },
    {
      key: 'productTypes',
      title: this.multiLanguageService.instant(
        'merchant.merchant_list.product'
      ),
      type: DATA_CELL_TYPE.TEXT,
      format: null,
      showed: true,
    },
    {
      key: 'status',
      title: this.multiLanguageService.instant('merchant.merchant_list.status'),
      type: DATA_CELL_TYPE.STATUS,
      format: DATA_STATUS_TYPE.USER_STATUS,
      showed: true,
    },
    {
      key: 'bdStaffId',
      title: this.multiLanguageService.instant(
        'merchant.merchant_list.merchant_manager'
      ),
      type: DATA_CELL_TYPE.TEXT,
      format: null,
      showed: false,
    },
    {
      key: 'createdAt',
      title: this.multiLanguageService.instant(
        'merchant.merchant_list.create_at'
      ),
      type: DATA_CELL_TYPE.DATETIME,
      format: 'dd/MM/yyyy hh:mm:ss',
      showed: true,
    },
    {
      key: 'updatedAt',
      title: this.multiLanguageService.instant(
        'merchant.merchant_list.updated_at'
      ),
      type: DATA_CELL_TYPE.DATETIME,
      format: 'dd/MM/yyyy hh:mm:ss',
      showed: true,
    },
    {
      key: 'updatedBy',
      title: this.multiLanguageService.instant(
        'merchant.merchant_list.updated_by'
      ),
      type: DATA_CELL_TYPE.TEXT,
      format: null,
      showed: true,
    },
    {
      key: 'address',
      title: this.multiLanguageService.instant(
        'merchant.merchant_list.location'
      ),
      type: DATA_CELL_TYPE.TEXT,
      format: null,
      showed: false,
    },
    {
      key: 'district',
      title: this.multiLanguageService.instant(
        'merchant.merchant_list.district'
      ),
      type: DATA_CELL_TYPE.TEXT,
      format: null,
      showed: false,
    },
    {
      key: 'merchantServiceFee',
      title: this.multiLanguageService.instant(
        'merchant.merchant_list.merchant_fee'
      ),
      type: DATA_CELL_TYPE.TEXT,
      format: null,
      showed: false,
    },
    {
      key: 'customerServiceFee',
      title: this.multiLanguageService.instant(
        'merchant.merchant_list.customer_fee'
      ),
      type: DATA_CELL_TYPE.TEXT,
      format: null,
      showed: false,
    },
  ];
  tableTitle: string = this.multiLanguageService.instant(
    'merchant.merchant_list.title'
  );
  hasSelect: boolean = true;
  selectButtons: TableSelectActionModel[] = [
    {
      hidden: false,
      action: 'delete',
      color: 'accent',
      content: this.multiLanguageService.instant(
        'merchant.merchant_list.delete_merchant'
      ),
      imageSrc: 'assets/img/icon/group-5/trash.svg',
      style: 'background-color: rgba(255, 255, 255, 0.1);',
    },
    {
      hidden: false,
      action: 'lock',
      color: 'accent',
      content: this.multiLanguageService.instant(
        'customer.individual_info.lock'
      ),
      imageSrc: 'assets/img/icon/group-5/lock-white.svg',
      style: 'background-color: rgba(255, 255, 255, 0.1);',
    },
  ];
  private readonly routeAllState$: Observable<Params>;
  totalItems: number = 0;
  filterForm: FormGroup;
  dataSource: MatTableDataSource<any> = new MatTableDataSource([]);
  pages: Array<number>;
  pageSize: number = 10;
  pageIndex: number = 0;
  pageLength: number = 0;
  pageSizeOptions: number[] = [10, 20, 50];
  expandedElementId: number;
  expandElementFromLoan;
  merchantInfo: any;
  subManager = new Subscription();
  breadcrumbOptions: BreadcrumbOptionsModel = {
    title: this.multiLanguageService.instant('breadcrumb.merchant'),
    iconImgSrc: 'assets/img/icon/group-7/svg/merchant.svg',
    searchPlaceholder:
      'Tên merchant, Số điện thoại, Email, Mã merchant, Tên Admin, Ngành hàng…',
    searchable: true,
    showBtnAdd: true,
    btnAddText: this.multiLanguageService.instant(
      'merchant.merchant_list.add_merchant'
    ),
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
      title: this.multiLanguageService.instant('filter.bd'),
      type: FILTER_TYPE.SELECT,
      controlName: 'bdStaffId',
      value: null,
      options: [
        {
          title: this.multiLanguageService.instant('filter.choose_bd'),
          value: null,
          showAction: false,
          subTitle: this.multiLanguageService.instant('filter.choose_bd'),
          subOptions: [],
          disabled: false,
          count: 0,
        },
      ],
    },
    {
      title: this.multiLanguageService.instant('filter.product_type'),
      type: FILTER_TYPE.SELECT,
      controlName: 'productTypes',
      value: null,
      options: [
        {
          title: this.multiLanguageService.instant('filter.choose_product'),
          value: null,
          showAction: false,
          subTitle: this.multiLanguageService.instant('filter.choose_product'),
          subOptions: [],
          disabled: false,
          count: 0,
        },
      ],
    },
    // {
    //   title: this.multiLanguageService.instant('filter.merchant_group'),
    //   type: FILTER_TYPE.MULTIPLE_CHOICE,
    //   controlName: 'companyId',
    //   value: null,
    //   showAction: true,
    //   titleAction: 'Thêm nhóm nhà cung cấp',
    //   actionIconClass: 'sprite-group-7-add-blue',
    //   options: [
    //     {
    //       title: 'Nhóm nhà cung cấp 1',
    //       note: '',
    //       value: '1',
    //       showAction: true,
    //       actionTitle: 'Sửa nhóm nhà cung cấp',
    //       actionIconClass: 'sprite-group-5-edit-blue',
    //       subTitle: 'casca',
    //       disabled: false,
    //       count: 0,
    //     },
    //     {
    //       title: 'Nhóm nhà cung cấp 2',
    //       note: 'zz',
    //       value: '2',
    //       showAction: true,
    //       actionTitle: 'Sửa nhóm nhà cung cấp',
    //       actionIconClass: 'sprite-group-5-edit-blue',
    //       subTitle: 'váv',
    //       disabled: false,
    //       count: 0,
    //     },
    //   ],
    // },
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

  constructor(
    private store: Store<fromStore.State>,
    private multiLanguageService: MultiLanguageService,
    private notificationService: NotificationService,
    private notifier: ToastrService,
    private formBuilder: FormBuilder,
    private router: Router,
    private dialog: MatDialog,
    private titleService: Title,
    private activatedRoute: ActivatedRoute,
    private adminControllerService: AdminControllerService,
    private merchantListService: MerchantListService
  ) {
    this.routeAllState$ = store.select(fromSelectors.getRouterAllState);
    this._initFilterForm();
  }

  ngOnInit(): void {
    this.store.dispatch(new fromActions.SetOperatorInfo(NAV_ITEM.MERCHANT));
    this._initOptions();
    this._initSubscription();
  }

  private _getMerchantList() {
    const params = this._buildParams();
    this.merchantListService
      .getData(params)
      .subscribe((data: ApiResponseSearchAndPaginationResponseMerchant) => {
        console.log('merchant list', data?.result);
        this._parseData(data?.result);
        this.dataSource.data = data?.result?.data;
        if (this.filterForm.controls.id.value) {
          this.expandElementFromLoan = data?.result?.data;
        }
      });
    // this.subManager.add(
    //   this.merlistService
    //     .v1AdminMerchantsGet()
    //     .subscribe((data: ApiResponseListMerchant) => {
    //       this.dataSource.data = data?.result;
    //     })
    // );
  }

  public onSortChange(sortState: Sort) {
    this.filterForm.controls.orderBy.setValue(sortState.active);
    this.filterForm.controls.sortDirection.setValue(sortState.direction);
    this._onFilterChange();
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
        if (event.controlName === 'bdStaffId') {
          this.filterForm.controls.bdStaffId.setValue(
            event.value ? event.value.join(',') : ''
          );
        } else if (event.controlName === 'productTypes') {
          this.filterForm.controls.productTypes.setValue(
            event.value ? event.value.join(',') : ''
          );
        }
        break;
      default:
        break;
    }
    this._onFilterChange();
  }

  private _initFilterForm() {
    this.filterForm = this.formBuilder.group({
      id: [''],
      keyword: [''],
      bdStaffId: [''],
      productTypes: [''],
      orderBy: ['createdAt'],
      sortDirection: ['desc'],
      startTime: [null],
      endTime: [null],
      dateFilterType: [''],
      dateFilterTitle: [''],
      filterConditions: {
        bdStaffId: QUERY_CONDITION_TYPE.IN,
        productTypes: QUERY_CONDITION_TYPE.IN,
      },
    });
  }

  private _resetFilterForm() {
    this.filterForm = this.formBuilder.group({
      id: [''],
      keyword: [''],
      bdStaffId: [''],
      productTypes: [''],
      orderBy: ['createdAt'],
      sortDirection: ['desc'],
      startTime: [null],
      endTime: [null],
      dateFilterType: [''],
      dateFilterTitle: [''],
      filterConditions: {
        bdStaffId: QUERY_CONDITION_TYPE.IN,
        productTypes: QUERY_CONDITION_TYPE.IN,
      },
    });
  }

  private _initSubscription() {
    this.subManager.add(
      this.routeAllState$.subscribe((params) => {
        this._parseQueryParams(params?.queryParams);
        this._getMerchantList();
      })
    );
  }

  private _parseQueryParams(params) {
    this._initFilterFormFromQueryParams(params);
    this._initFilterOptionsFromQueryParams(params);

    this.breadcrumbOptions.keyword = params.keyword;
    this.pageIndex = params.pageIndex || 0;
    this.pageSize = params.pageSize || 20;
  }

  private _initFilterFormFromQueryParams(params) {
    let filterConditionsValue =
      this.filterForm.controls.filterConditions?.value;
    if (_.isEmpty(params)) {
      this._resetFilterForm();
      this._resetFilterOptions();
    }

    for (const [param, paramValue] of Object.entries(params)) {
      let paramHasCondition = param.split('__');
      if (paramHasCondition.length > 1) {
        this.filterForm.controls[paramHasCondition[0]]?.setValue(
          paramValue || ''
        );
        filterConditionsValue[paramHasCondition[0]] =
          '__' + paramHasCondition[1];
      } else {
        if (this.filterForm.controls[param]) {
          this.filterForm.controls[param]?.setValue(paramValue || '');
        }
      }
    }
    this.filterForm.controls.filterConditions.setValue(filterConditionsValue);
  }

  private _initFilterOptionsFromQueryParams(params) {
    this.filterOptions.forEach((filterOption) => {
      if (filterOption.type === FILTER_TYPE.DATETIME) {
        filterOption.value = {
          type: params.dateFilterType,
          title: params.dateFilterTitle,
        };
      } else if (filterOption.controlName === 'productTypes') {
        filterOption.value = this.filterForm.controls.productTypes.value
          ? this.filterForm.controls.productTypes.value.split(',')
          : [];
      } else if (filterOption.controlName === 'bdStaffId') {
        filterOption.value = this.filterForm.controls.bdStaffId.value
          ? this.filterForm.controls.bdStaffId.value.split(',')
          : [];
      } else if (filterOption.controlName === 'status') {
        filterOption.value = this.filterForm.controls.status.value
          ? this.filterForm.controls.status.value
          : null;
      }
    });
  }

  private _resetFilterOptions() {
    let newFilterOptions = JSON.parse(JSON.stringify(this.filterOptions));
    newFilterOptions.forEach((filterOption) => {
      filterOption.value = null;
    });
    this.filterOptions = newFilterOptions;
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
      .then((r) => {
      });
  }

  @ViewChild(BaseManagementLayoutComponent)
  child: BaseManagementLayoutComponent;

  triggerDeselectUsers() {
    this.child.triggerDeselectUsers();
  }

  public onOutputAction(event) {
    const action = event.action;
    const list = event.selectedList;
    const idArr = list.map((merchant) => merchant.id);
    switch (action) {
      case 'lock':
        this.lockMultiplePrompt(idArr);
        break;
      case 'delete':
        this.deleteMultiplePrompt(idArr);
        break;
      default:
        return;
    }
  }

  private _initOptions() {
    this.filterOptions.forEach((filterOption: FilterOptionModel) => {
      if (filterOption.controlName !== 'bdStaffId' || !this.bdList) {
        return;
      }
      filterOption.options[0].subOptions = this.bdList.map((bd) => {
        return {
          title: bd.name,
          value: bd.id,
          imgSrc: null,
          code: null,
        };
      });
    });
    this.filterOptions.forEach((filterOption: FilterOptionModel) => {
      if (filterOption.controlName !== 'productTypes' || !this.productList) {
        return;
      }
      filterOption.options[0].subOptions = this.productList.map((product) => {
        return {
          title: product.name,
          value: product.id,
          imgSrc: null,
          code: null,
        };
      });
    });
  }

  public lockMultiplePrompt(ids) {
    const confirmLockRef = this.notificationService.openPrompt({
      imgUrl: '../../../../../assets/img/icon/group-5/Alert.svg',
      title: this.multiLanguageService.instant(
        'system.user_detail.lock_user.title'
      ),
      content: this.multiLanguageService.instant(
        'system.user_detail.lock_user.content'
      ),
      primaryBtnText: this.multiLanguageService.instant('common.lock'),
      primaryBtnClass: 'btn-error',
      secondaryBtnText: this.multiLanguageService.instant('common.skip'),
    });
    confirmLockRef.afterClosed().subscribe((result) => {
      if (result === BUTTON_TYPE.PRIMARY) {
        this._doMultipleAction(ids, 'lock');
      }
    });
  }

  public _doMultipleAction(ids, action) {
    if (!ids) {
      return;
    }
    ids.forEach((id) => {
      if (action === 'lock') {
        this._lockById(id);
      } else {
        this._deleteById(id);
      }
    });
  }

  private _lockById(id: string) {
    if (!id) {
      return;
    }
    this.subManager.add(
      this.adminControllerService
        .v1AdminMerchantsIdPut(id, {status: 'LOCKED'})
        .subscribe(
          (result: ApiResponseMerchant) => {
            if (!result || result.responseCode !== RESPONSE_CODE.SUCCESS) {
              return this.notifier.error(
                JSON.stringify(result?.message),
                result?.errorCode
              );
            }

            this.notifier.success(
              this.multiLanguageService.instant(
                'merchant.merchant_detail.lock_merchant.toast'
              )
            );
          },
          (error) => {
          },
          () => {
            setTimeout(() => {
              this.triggerDeselectUsers();
              this.refreshContent();
            }, 3000);
          }
        )
    );
  }

  public deleteMultiplePrompt(ids) {
    const confirmDeleteRef = this.notificationService.openPrompt({
      imgUrl: '../../../../../assets/img/icon/group-5/delete-dialog.svg',
      title: this.multiLanguageService.instant(
        'merchant.merchant_detail.delete_merchant.title'
      ),
      content: this.multiLanguageService.instant(
        'merchant.merchant_detail.delete_merchant.content'
      ),
      primaryBtnText: this.multiLanguageService.instant('common.delete'),
      primaryBtnClass: 'btn-error',
      secondaryBtnText: this.multiLanguageService.instant('common.skip'),
    });
    confirmDeleteRef.afterClosed().subscribe((result) => {
      if (result === BUTTON_TYPE.PRIMARY) {
        this._doMultipleAction(ids, 'delete');
      }
    });
  }

  private _deleteById(id: string) {
    if (!id) {
      return;
    }
    this.subManager.add(
      this.adminControllerService.v1AdminMerchantsIdDelete(id).subscribe(
        (result: ApiResponseString) => {
          if (!result || result.responseCode !== RESPONSE_CODE.SUCCESS) {
            return this.notifier.error(
              JSON.stringify(result?.message),
              result?.errorCode
            );
          }

          this.notifier.success(
            this.multiLanguageService.instant(
              'merchant.merchant_detail.delete_merchant.toast'
            )
          );
        },
        (error) => {
        },
        () => {
          setTimeout(() => {
            this.triggerDeselectUsers();
            this.refreshContent();
          }, 3000);
        }
      )
    );
  }

  public onPageChange(event: PageEvent) {
    this.pageSize = event.pageSize;
    this.pageIndex = event.pageIndex;
    this._onFilterChange();
  }

  public onFilterActionTrigger(event: FilterActionEventModel) {
    if (event.type === 'FILTER_EXTRA_ACTION') {
      const addMerchantGroupDialogRef = this.dialog.open(
        MerchantGroupDialogComponent,
        {
          panelClass: 'custom-info-dialog-container',
          maxWidth: '360px',
          width: '90%',
        }
      );
    } else {
      const editMerchantGroupDialogRef = this.dialog.open(
        MerchantGroupDialogComponent,
        {
          panelClass: 'custom-info-dialog-container',
          maxWidth: '360px',
          width: '90%',
          data: {
            merchantGroupInfo: this.filterOptions[0].options.filter(
              (option) => option.value === event.value
            )[0],
            dialogTitle: this.multiLanguageService.instant(
              'merchant.merchant_dialog.edit_group_title'
            ),
          },
        }
      );
    }
  }

  public onExpandElementChange(element: any) {
    this.expandedElementId = element.id;
  }

  onClickBtnAdd(event) {
    const addMerchantDialogRef = this.dialog.open(
      MerchantDetailDialogComponent,
      {
        panelClass: 'custom-info-dialog-container',
        maxWidth: '1200px',
        width: '90%',
      }
    );
    this.subManager.add(
      addMerchantDialogRef.afterClosed().subscribe((result: any) => {
        if (result && result.type === BUTTON_TYPE.PRIMARY) {
          let createRequest = this._bindingDialogData(result.data);
          this.sendAddRequest(createRequest);
        }
      })
    );
  }

  sendAddRequest(addRequest) {
    this.subManager.add(
      this.adminControllerService
        .v1AdminMerchantsPost(addRequest)
        .subscribe((result: ApiResponseMerchant) => {
          if (!result || result.responseCode !== RESPONSE_CODE.SUCCESS) {
            return this.notifier.error(
              JSON.stringify(result?.message),
              result?.errorCode
            );
          }
          setTimeout(() => {
            this.notifier.success(
              this.multiLanguageService.instant('common.create_success')
            );
            this.refreshContent();
            this.notificationService.hideLoading();
          }, 3000);
        })
    );
  }

  public refreshContent() {
    setTimeout(() => {
      this._getMerchantList();
    }, 2000);
  }

  private _bindingDialogData(data) {
    return {
      code: data?.code ? data?.code : null,
      name: data?.name ? data?.name : null,
      address: data?.address ? data?.address : null,
      ward: data?.ward ? data?.ward : null,
      district: data?.district ? data?.district : null,
      province: data?.province ? data?.province : null,
      bdStaffId: data?.bdStaffId ? data?.bdStaffId : null,
      sellTypes: data?.sellTypes ? data?.sellTypes : null,
      mobile: data?.mobile ? data?.mobile : null,
      email: data?.email ? data?.email : null,
      website: data?.website ? data?.website : null,
      identificationNumber: data?.identificationNumber
        ? data?.identificationNumber
        : null,
      establishTime: data?.establishTime ? data?.establishTime : null,
      productTypes: data?.productTypes ? data?.productTypes : null,
      merchantServiceFee: data?.merchantServiceFee
        ? parseInt(data?.merchantServiceFee)
        : 0.0,
      customerServiceFee: parseInt(data?.customerServiceFee)
        ? data?.customerServiceFee
        : 0.0,
      status: data?.status ? data?.status : 'ACTIVE',
      logo: data?.logo ? data?.logo : null,
      description: data?.description ? data?.description : null,
      descriptionImg: data?.descriptionImg ? data?.descriptionImg : null,
    };
  }

  public updateElementInfo(updatedMerchantInfo) {
    if (!updatedMerchantInfo) {
      setTimeout(() => {
        // this.triggerDeselectUsers();
        this._getMerchantList();
      }, 2000);
    }
    this.dataSource.data.map((item) => {
      if (item.id === updatedMerchantInfo.id) {
        this.allColumns.forEach((column) => {
          item[column.key] = updatedMerchantInfo[column.key];
        });
      }
      return item;
    });
    // this.refreshContent();
  }
}
