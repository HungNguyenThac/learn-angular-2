import { Component, OnInit } from '@angular/core';
import { TableSelectActionModel } from '../../../../public/models/external/table-select-action.model';
import { MultiLanguageService } from '../../../../share/translate/multiLanguageService';
import { NotificationService } from '../../../../core/services/notification.service';
import { ToastrService } from 'ngx-toastr';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Sort } from '@angular/material/sort';
import { FilterEventModel } from '../../../../public/models/filter/filter-event.model';
import {
  DATA_CELL_TYPE,
  DATA_STATUS_TYPE,
  FILTER_TYPE,
  QUERY_CONDITION_TYPE,
} from '../../../../core/common/enum/operator';
import { ActivatedRoute, Router } from '@angular/router';
import { FilterOptionModel } from '../../../../public/models/filter/filter-option.model';
import {
  PAYDAY_LOAN_UI_STATUS,
  PAYDAY_LOAN_UI_STATUS_TEXT,
} from '../../../../core/common/enum/payday-loan';
import { BreadcrumbOptionsModel } from '../../../../public/models/external/breadcrumb-options.model';
import { MatTableDataSource } from '@angular/material/table';
import { PageEvent } from '@angular/material/paginator/public-api';
import { FilterActionEventModel } from '../../../../public/models/filter/filter-action-event.model';
import { AddNewUserDialogComponent } from '../../../../share/components';
import { MatDialog } from '@angular/material/dialog';
import { MerchantDetailDialogComponent } from '../../../../share/components/operators/merchant/merchant-detail-dialog/merchant-detail-dialog.component';
import { MerchantGroupDialogComponent } from '../../../../share/components/operators/merchant/merchant-group-dialog/merchant-group-dialog.component';

@Component({
  selector: 'app-merchant-list',
  templateUrl: './merchant-list.component.html',
  styleUrls: ['./merchant-list.component.scss'],
})
export class MerchantListComponent implements OnInit {
  //Mock data
  merchantList: any[] = [
    {
      merchantId: 'NCC-726',
      merchantName: 'EPAY',
      merchantStatus: 'Đang hoạt động',
      merchantPhone: '0982737261',
      merchantEmail: 'email@gmail.com',
      merchantDate: '01/12/2012',
      merchantGroup: ['Nhóm nhà cung cấp 1'],
      merchantGroupId: [1],
      merchantCompany: 'EGO',
      merchantTaxNumber: '70294762',
      merchantRegistrationNumber: '16413340',
      merchantWebsite: 'https://www.msig.com.vn/',
      merchantAddress: '36 Hoàng Cầu, Ô Chợ Dừa, Đống Đa, Hà Nội',
      creator: 'Minh Nguyễn',
      createDate: 'Ngày tạo',
      merchantNote: '',
      contactor: 'Tạ Sơn Quỳnh',
      role: 'Nhân viên',
      phone: '0938729394',
      mailTo: 'email@gmail.com',
      mailCc: 'email@gmail.com',
      bankId: 1,
      bank: 'Ngân hàng Việt Nam Thịnh Vượng',
      branch: 'Đông Đô',
      accountNum: '16413340',
      accountName: 'TA SON QUYNH',
      note: '',
    },
    {
      merchantId: 'NCC-40',
      merchantName: 'CMC',
      merchantStatus: 'Đang hoạt động',
      merchantPhone: '0986375176',
      merchantEmail: 'email@gmail.com',
      merchantDate: '5/27/15',
      merchantGroup: ['Nhóm nhà cung cấp 2'],
      merchantGroupId: [2],
      merchantCompany: 'CMC',
      merchantTaxNumber: '16413340',
      merchantRegistrationNumber: '16413340',
      merchantWebsite: 'https://www.msig.com.vn/',
      merchantAddress: '36 Hoàng Cầu, Ô Chợ Dừa, Đống Đa, Hà Nội',
      creator: 'Minh Nguyễn',
      createDate: 'Ngày tạo',
      merchantNote: '',
      contactor: 'Tạ Sơn Quỳnh',
      role: 'Nhân viên',
      phone: '0938729394',
      mailTo: 'email@gmail.com',
      mailCc: 'email@gmail.com',
      bankId: 2,
      bank: 'Ngân hàng Pro Vip',
      branch: 'Đông Đô',
      accountNum: '16413340',
      accountName: 'TA SON QUYNH',
      note: '',
    },
    {
      merchantId: 'NCC-422',
      merchantName: 'HMG',
      merchantStatus: 'Đang hoạt động',
      merchantPhone: '0917749254',
      merchantEmail: 'email@gmail.com',
      merchantDate: '8/15/17',
      merchantGroup: ['Nhóm nhà cung cấp 3'],
      merchantGroupId: [3],
      merchantCompany: 'EGO',
      merchantTaxNumber: '51497991',
      merchantRegistrationNumber: '16413340',
      merchantWebsite: 'https://www.msig.com.vn/',
      merchantAddress: '36 Hoàng Cầu, Ô Chợ Dừa, Đống Đa, Hà Nội',
      creator: 'Minh Nguyễn',
      createDate: '07/21/2018 08:37 PM',
      merchantNote: '',
      contactor: 'Tạ Sơn Quỳnh',
      role: 'Nhân viên',
      phone: '0938729394',
      mailTo: 'email@gmail.com',
      mailCc: 'email@gmail.com',
      bank: 'Ngân hàng Vip',
      bankId: 3,
      branch: 'Đông Đô',
      accountNum: '16413340',
      accountName: 'TA SON QUYNH',
      note: '',
    },
  ];
  allColumns: any[] = [
    {
      key: 'merchantId',
      title: this.multiLanguageService.instant('merchant.merchant_list.id'),
      type: DATA_CELL_TYPE.TEXT,
      format: null,
      showed: true,
    },
    {
      key: 'merchantName',
      title: this.multiLanguageService.instant('merchant.merchant_list.name'),
      type: DATA_CELL_TYPE.TEXT,
      format: null,
      showed: true,
    },
    {
      key: 'merchantPhone',
      title: this.multiLanguageService.instant('merchant.merchant_list.phone'),
      type: DATA_CELL_TYPE.TEXT,
      format: null,
      showed: true,
    },
    {
      key: 'merchantDate',
      title: this.multiLanguageService.instant('merchant.merchant_list.date'),
      type: DATA_CELL_TYPE.TEXT,
      format: null,
      showed: true,
    },
    {
      key: 'merchantCompany',
      title: this.multiLanguageService.instant(
        'merchant.merchant_list.company'
      ),
      type: DATA_CELL_TYPE.TEXT,
      format: null,
      showed: true,
    },
    {
      key: 'merchantTaxNumber',
      title: this.multiLanguageService.instant('merchant.merchant_list.tax_no'),
      type: DATA_CELL_TYPE.TEXT,
      format: null,
      showed: true,
    },
  ];
  tableTitle: string = this.multiLanguageService.instant(
    'merchant.merchant_list.title'
  );
  hasSelect: boolean = false;
  selectButtons: TableSelectActionModel[];
  totalItems: number = 0;
  filterForm: FormGroup;
  dataSource: MatTableDataSource<any> = new MatTableDataSource([]);
  pages: Array<number>;
  pageSize: number = 10;
  pageIndex: number = 0;
  pageLength: number = 0;
  pageSizeOptions: number[] = [10, 20, 50];
  expandedElementId: number;
  merchantInfo: any;
  breadcrumbOptions: BreadcrumbOptionsModel = {
    title: this.multiLanguageService.instant('breadcrumb.merchant'),
    iconImgSrc: 'assets/img/icon/group-7/svg/merchant.svg',
    searchPlaceholder: 'Tên hoặc mã NCC, Số điện thoại, Email...',
    searchable: true,
    showBtnAdd: true,
    btnAddText: this.multiLanguageService.instant(
      'merchant.merchant_list.add_merchant'
    ),
    keyword: '',
  };
  filterOptions: FilterOptionModel[] = [
    {
      title: this.multiLanguageService.instant('filter.merchant_group'),
      type: FILTER_TYPE.MULTIPLE_CHOICE,
      controlName: 'companyId',
      value: null,
      showAction: true,
      titleAction: 'Thêm nhóm nhà cung cấp',
      actionIconClass: 'sprite-group-7-add-blue',
      options: [
        {
          title: 'Nhóm nhà cung cấp 1',
          note: '',
          value: '1',
          showAction: true,
          actionTitle: 'Sửa nhóm nhà cung cấp',
          actionIconClass: 'sprite-group-5-edit-blue',
          subTitle: 'casca',
          disabled: false,
          count: 0,
        },
        {
          title: 'Nhóm nhà cung cấp 2',
          note: 'zz',
          value: '2',
          showAction: true,
          actionTitle: 'Sửa nhóm nhà cung cấp',
          actionIconClass: 'sprite-group-5-edit-blue',
          subTitle: 'váv',
          disabled: false,
          count: 0,
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

  constructor(
    private multiLanguageService: MultiLanguageService,
    private notificationService: NotificationService,
    private notifier: ToastrService,
    private formBuilder: FormBuilder,
    private router: Router,
    private dialog: MatDialog,
    private activatedRoute: ActivatedRoute
  ) {
    this._initFilterForm();
  }

  ngOnInit(): void {
    this.dataSource.data = this.merchantList;
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

  public onOutputAction(event) {
    const action = event.action;
    const list = event.selectedList;
    switch (action) {
      case 'lock':
        this.lockPrompt();
        break;
      case 'delete':
        this.deletePrompt();
        break;
      default:
        return;
    }
  }

  // @ts-ignore
  public lockPrompt(): boolean {
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
    confirmLockRef.afterClosed().subscribe((result) => {});
  }

  public deletePrompt() {
    const confirmDeleteRef = this.notificationService.openPrompt({
      imgUrl: '../../../../../assets/img/icon/group-5/delete-dialog.svg',
      title: this.multiLanguageService.instant(
        'system.user_detail.delete_user.title'
      ),
      content: this.multiLanguageService.instant(
        'system.user_detail.delete_user.content'
      ),
      primaryBtnText: this.multiLanguageService.instant('common.delete'),
      primaryBtnClass: 'btn-error',
      secondaryBtnText: this.multiLanguageService.instant('common.skip'),
    });
    confirmDeleteRef.afterClosed().subscribe((result) => {
      if (result === 'PRIMARY') {
        this.notifier.success(
          this.multiLanguageService.instant(
            'system.user_detail.delete_user.toast'
          )
        );
      }
    });
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
    this.expandedElementId = element.merchantId;
    this.merchantInfo = this.merchantList.filter(
      (merchant) => merchant.merchantId === element.merchantId
    )[0];
  }

  onClickBtnAdd(event) {
    const addMerchantDialogRef = this.dialog.open(
      MerchantDetailDialogComponent,
      {
        panelClass: 'custom-info-dialog-container',
        maxWidth: '800px',
        width: '90%',
      }
    );
  }
}
