import {Component, OnInit, ViewChild} from '@angular/core';
import {
  AdminAccountEntity,
  ApiResponseSearchAndPaginationResponseAdminAccountEntity,
  CompanyControllerService,
  GroupControllerService,
  GroupEntity,
  PermissionTypeControllerService,
} from '../../../../../../../open-api-modules/dashboard-api-docs';
import {TableSelectActionModel} from '../../../../../public/models/external/table-select-action.model';
import {Observable, Subscription} from 'rxjs';
import {BreadcrumbOptionsModel} from '../../../../../public/models/external/breadcrumb-options.model';
import {FilterOptionModel} from '../../../../../public/models/filter/filter-option.model';
import * as _ from 'lodash';
import {
  BUTTON_TYPE,
  DATA_CELL_TYPE,
  DATA_STATUS_TYPE,
  FILTER_ACTION_TYPE,
  FILTER_TYPE,
  QUERY_CONDITION_TYPE,
  RESPONSE_CODE,
} from '../../../../../core/common/enum/operator';
import {DisplayedFieldsModel} from '../../../../../public/models/filter/displayed-fields.model';
import {MatTableDataSource} from '@angular/material/table';
import {FormBuilder, FormGroup} from '@angular/forms';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {Title} from '@angular/platform-browser';
import {Store} from '@ngrx/store';
import * as fromStore from '../../../../../core/store';
import * as fromSelectors from '../../../../../core/store';
import * as fromActions from '../../../../../core/store';
import {MultiLanguageService} from '../../../../../share/translate/multiLanguageService';
import {NotificationService} from '../../../../../core/services/notification.service';
import {ToastrService} from 'ngx-toastr';
import {
  AdminAccountControllerService,
  ApiResponseAdminAccountEntity,
} from '../../../../../../../open-api-modules/identity-api-docs';
import {MatDialog} from '@angular/material/dialog';
import {UserListService} from '../../../user/user-list/user-list.service';
import {NgxPermissionsService} from 'ngx-permissions';
import {PageEvent} from '@angular/material/paginator/public-api';
import {Sort} from '@angular/material/sort';
import {FilterEventModel} from '../../../../../public/models/filter/filter-event.model';
import {FilterActionEventModel} from '../../../../../public/models/filter/filter-action-event.model';
import {BaseManagementLayoutComponent,} from '../../../../../share/components';
import * as moment from 'moment';
import {
  ProductStatusDialogComponent
} from '../../../../../share/components/operators/product-config/product-status-dialog/product-status-dialog.component';

@Component({
  selector: 'app-product-status-list',
  templateUrl: './product-status-list.component.html',
  styleUrls: ['./product-status-list.component.scss'],
})
export class ProductStatusListComponent implements OnInit {
  //Mock data
  statusList: any[] = [
    {
      name: 'Trạng thái 1',
      description: 'Mô tả 1',
      status: 'ACTIVE',
      createdAt: '01/01/2022 13:22',
      updatedAt: '01/01/2022 13:22',
      updatedBy: 'user1',
    },
    {
      name: 'Trạng thái 2',
      description: 'Mô tả 2',
      status: 'LOCKED',
      createdAt: '02/01/2022 12:21',
      updatedAt: '03/01/2022 15:32',
      updatedBy: 'user2',
    },
  ];
  roleList: Array<GroupEntity>;
  selectButtons: TableSelectActionModel[] = [
    {
      hidden: false,
      action: 'delete',
      color: 'accent',
      content: this.multiLanguageService.instant('product_status.delete'),
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

  subManager = new Subscription();
  tableTitle: string = this.multiLanguageService.instant('product_status.list');
  breadcrumbOptions: BreadcrumbOptionsModel = {
    title: this.multiLanguageService.instant('breadcrumb.product_status'),
    iconImgSrc: 'assets/img/icon/group-5/person-roll.svg',
    searchPlaceholder: this.multiLanguageService.instant(
      'breadcrumb.search_field_user_list'
    ),
    searchable: true,
    showBtnAdd: false,
    btnAddText: this.multiLanguageService.instant('product_status.add'),
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
      title: this.multiLanguageService.instant('filter.account_status'),
      type: FILTER_TYPE.SELECT,
      controlName: 'userStatus',
      value: null,
      options: [
        {
          title: this.multiLanguageService.instant('common.all'),
          value: null,
        },
        {
          title: this.multiLanguageService.instant('common.active'),
          value: AdminAccountEntity.UserStatusEnum.Active,
        },
        {
          title: this.multiLanguageService.instant('common.inactive'),
          value: AdminAccountEntity.UserStatusEnum.Locked,
        },
      ],
    },
  ];

  allColumns: DisplayedFieldsModel[] = [
    {
      key: 'name',
      title: this.multiLanguageService.instant('product_status.name'),
      type: DATA_CELL_TYPE.TEXT,
      format: null,
      showed: true,
    },
    {
      key: 'status',
      title: this.multiLanguageService.instant('product_status.status'),
      type: DATA_CELL_TYPE.STATUS,
      format: DATA_STATUS_TYPE.USER_STATUS,
      showed: true,
    },
    {
      key: 'createdAt',
      title: this.multiLanguageService.instant('product_status.created_at'),
      type: DATA_CELL_TYPE.TEXT,
      format: null,
      showed: true,
    },
    {
      key: 'updatedAt',
      title: this.multiLanguageService.instant('product_status.updated_at'),
      type: DATA_CELL_TYPE.TEXT,
      format: null,
      showed: true,
    },
    {
      key: 'updatedBy',
      title: this.multiLanguageService.instant('product_status.updated_by'),
      type: DATA_CELL_TYPE.TEXT,
      format: null,
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
  expandElementFromLoan;
  hasSelect: boolean = true;
  userInfo: any;
  private readonly routeAllState$: Observable<Params>;

  constructor(
    private titleService: Title,
    private store: Store<fromStore.State>,
    private multiLanguageService: MultiLanguageService,
    private notificationService: NotificationService,
    private permissionTypeControllerService: PermissionTypeControllerService,
    private notifier: ToastrService,
    private companyControllerService: CompanyControllerService,
    private adminAccountControllerService: AdminAccountControllerService,
    private groupControllerService: GroupControllerService,
    private formBuilder: FormBuilder,
    private router: Router,
    private dialog: MatDialog,
    private activatedRoute: ActivatedRoute,
    private userListService: UserListService,
    private permissionsService: NgxPermissionsService
  ) {
    this.routeAllState$ = store.select(fromSelectors.getRouterAllState);

    this._initFilterForm();
  }

  ngOnInit(): void {
    this.store.dispatch(new fromActions.SetOperatorInfo(null));
    this._initSubscription();
    this._getStatusList();
  }

  private _getStatusList() {
    this.dataSource.data = this.statusList;
  }

  private async _checkActionPermissions() {
    const hasCredentialsCreatePermission =
      await this.permissionsService.hasPermission('credentials:create');
    const hasDeleteAccountPermission =
      await this.permissionsService.hasPermission(
        'credentials:deleteAdminAccount'
      );
    const hasLockMultipleAccountPermission =
      await this.permissionsService.hasPermission(
        'credentials:lockMultiAccount'
      );

    if (hasCredentialsCreatePermission) {
      this.breadcrumbOptions.showBtnAdd = true;
    }

    let selectedButtons = JSON.parse(JSON.stringify(this.selectButtons));
    selectedButtons.forEach((button) => {
      if (button.action === 'delete') {
        button.hidden = !hasDeleteAccountPermission;
        return;
      }
      if (button.action === 'lock') {
        button.hidden = !hasLockMultipleAccountPermission;
      }
    });

    this.selectButtons = selectedButtons;
  }

  private _getUserList() {
    const params = this._buildParams();
    this.userListService
      .getData(params)
      .subscribe(
        (data: ApiResponseSearchAndPaginationResponseAdminAccountEntity) => {
          this._parseData(data?.result);
          this.dataSource.data = data?.result?.data;
          if (this.filterForm.controls.id.value) {
            this.expandElementFromLoan = data?.result?.data[0];
          }
        }
      );
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
    this.openUpdateDialog(element);
  }

  public openUpdateDialog(info) {
    const dialogRef = this.dialog.open(ProductStatusDialogComponent, {
      panelClass: 'custom-info-dialog-container',
      maxWidth: '800px',
      width: '90%',
      data: {
        info: info,
        dialogTitle: this.multiLanguageService.instant('product_status.update'),
      },
    });
  }

  public onSubmitSearchForm(event) {
    this.filterForm.controls.keyword.setValue(event.keyword);
    this._onFilterChange();
  }

  public onFilterFormChange(event: FilterEventModel) {
    console.log('FilterEventModel', event);
    this.pageIndex = 0;

    switch (event.type) {
      case FILTER_TYPE.DATETIME:
        this.filterForm.controls.startTime.setValue(event.value.startDate);
        this.filterForm.controls.endTime.setValue(event.value.endDate);
        this.filterForm.controls.dateFilterType.setValue(event.value.type);
        this.filterForm.controls.dateFilterTitle.setValue(event.value.title);
        break;
      case FILTER_TYPE.MULTIPLE_CHOICE:
        if (event.controlName === 'groupId') {
          this.filterForm.controls.groupId.setValue(
            event.value ? event.value.join(',') : ''
          );
          if (_.isEmpty(event.value)) {
            this.changeActionSelectAllGroupTitle(
              this.multiLanguageService.instant('filter.select_all')
            );
          } else {
            this.changeActionSelectAllGroupTitle(
              this.multiLanguageService.instant('filter.deselect_all')
            );
          }
        }
        break;
      case FILTER_TYPE.SELECT:
        if (event.controlName === 'userStatus') {
          this.filterForm.controls.userStatus.setValue(
            event.value ? event.value : ''
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
    if (event.type === FILTER_ACTION_TYPE.FILTER_EXTRA_ACTION) {
      if (event.controlName === 'groupId') {
        this.handleFilterActionTriggerGroupId(event);
      }
    }
  }

  private handleFilterActionTriggerGroupId(event: FilterActionEventModel) {
    if (event.actionControlName === 'SELECT_ALL_GROUP') {
      let groupIdValue = null;

      if (_.isEmpty(event.value)) {
        groupIdValue = this.roleList.map((role) => {
          return role.id;
        });
        this.changeActionSelectAllGroupTitle(
          this.multiLanguageService.instant('filter.deselect_all')
        );
      } else {
        this.changeActionSelectAllGroupTitle(
          this.multiLanguageService.instant('filter.select_all')
        );
      }

      this.onFilterFormChange({
        type: FILTER_TYPE.MULTIPLE_CHOICE,
        controlName: 'groupId',
        value: groupIdValue,
      });
    }
  }

  private changeActionSelectAllGroupTitle(title: string) {
    this.filterOptions.forEach((filterOption) => {
      if (filterOption.controlName === 'groupId') {
        filterOption.titleAction =
          title || this.multiLanguageService.instant('filter.select_all');
      }
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
    const idArr = list.map((user) => user.id);
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
  }

  formatTimeSecond(timeInput) {
    if (!timeInput) return;
    return moment(new Date(timeInput), 'YYYY-MM-DD HH:mm:ss').format(
      'DD/MM/YYYY HH:mm:ss'
    );
  }

  private _initFilterForm() {
    this.filterForm = this.formBuilder.group({
      id: [''],
      keyword: [''],
      groupId: [''],
      userStatus: [''],
      orderBy: ['createdAt'],
      sortDirection: ['desc'],
      startTime: [null],
      endTime: [null],
      dateFilterType: [''],
      dateFilterTitle: [''],
      filterConditions: {
        groupId: QUERY_CONDITION_TYPE.IN,
        userStatus: QUERY_CONDITION_TYPE.EQUAL,
      },
    });
  }

  private _initSubscription() {
    this.subManager.add(
      this.routeAllState$.subscribe((params) => {
        this._parseQueryParams(params?.queryParams);
      })
    );

    this.subManager.add(
      this.permissionsService.permissions$.subscribe((permissions) => {
        if (permissions) {
          this._checkActionPermissions();
        }
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
      } else if (filterOption.controlName === 'groupId') {
        filterOption.value = this.filterForm.controls.groupId.value
          ? this.filterForm.controls.groupId.value.split(',')
          : [];
      } else if (filterOption.controlName === 'userStatus') {
        filterOption.value = this.filterForm.controls.userStatus.value
          ? this.filterForm.controls.userStatus.value
          : null;
      }
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

  onClickBtnAdd(event) {
    const dialogRef = this.dialog.open(ProductStatusDialogComponent, {
      panelClass: 'custom-info-dialog-container',
      maxWidth: '800px',
      width: '90%',
      data: {
        dialogTitle: this.multiLanguageService.instant('product_status.add'),
      },
    });
  }

  sendAddUserRequest(updateInfoRequest) {
    this.subManager.add(
      this.adminAccountControllerService
        .create3(updateInfoRequest)
        .subscribe((result: ApiResponseAdminAccountEntity) => {
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
      this._getUserList();
    }, 2000);
  }

  private _bindingDialogUserData(data) {
    return {
      groupId: data?.accountRole,
      username: data?.username,
      secret: data?.accountPassword,
      fullName: data?.accountName,
      email: data?.accountEmail,
      mobile: data?.accountPhone,
      note: data?.accountNote,
      position: data?.accountPosition,
    };
  }

  private _resetFilterForm() {
    this.filterForm.patchValue({
      id: '',
      keyword: '',
      groupId: '',
      userStatus: '',
      orderBy: 'createdAt',
      sortDirection: 'desc',
      startTime: null,
      endTime: null,
      dateFilterType: '',
      dateFilterTitle: '',
      filterConditions: {
        groupId: QUERY_CONDITION_TYPE.IN,
        userStatus: QUERY_CONDITION_TYPE.EQUAL,
      },
    });
  }

  private _resetFilterOptions() {
    let newFilterOptions = JSON.parse(JSON.stringify(this.filterOptions));
    newFilterOptions.forEach((filterOption) => {
      filterOption.value = null;
    });
    this.filterOptions = newFilterOptions;
  }

  private _initRoleOptions() {
    this.filterOptions.forEach((filterOption: FilterOptionModel) => {
      if (filterOption.controlName !== 'groupId' || !this.roleList) {
        return;
      }
      filterOption.options = this.roleList.map((role) => {
        return {
          title: role.name,
          value: role.id,
        };
      });
    });
  }

  public updateElementInfo(updatedUserInfo) {
    if (!updatedUserInfo) {
      setTimeout(() => {
        this.triggerDeselectUsers();
        this._getUserList();
      }, 2000);
    }
    this.dataSource.data.map((item) => {
      if (item.id === updatedUserInfo.id) {
        this.allColumns.forEach((column) => {
          item[column.key] = updatedUserInfo[column.key];
        });
      }
      return item;
    });
    // this.refreshContent();
  }

  ngOnDestroy(): void {
    if (this.subManager !== null) {
      this.subManager.unsubscribe();
    }
  }
}
