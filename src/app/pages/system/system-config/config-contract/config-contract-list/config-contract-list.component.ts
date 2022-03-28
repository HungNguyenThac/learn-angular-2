import { Component, OnInit, ViewChild } from '@angular/core';
import {
  BaseManagementLayoutComponent,
  MerchantGroupDialogComponent,
} from '../../../../../share/components';
import {
  DATA_CELL_TYPE,
  FILTER_ACTION_TYPE,
  FILTER_TYPE,
  QUERY_CONDITION_TYPE,
  RESPONSE_CODE,
  TABLE_ACTION_TYPE,
} from '../../../../../core/common/enum/operator';
import { TableSelectActionModel } from '../../../../../public/models/external/table-select-action.model';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { Observable, Subscription } from 'rxjs';
import { BreadcrumbOptionsModel } from '../../../../../public/models/external/breadcrumb-options.model';
import { FilterOptionModel } from '../../../../../public/models/filter/filter-option.model';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { MultiLanguageService } from '../../../../../share/translate/multiLanguageService';
import { NotificationService } from '../../../../../core/services/notification.service';
import { ToastrService } from 'ngx-toastr';
import { MatDialog } from '@angular/material/dialog';
import { Title } from '@angular/platform-browser';
import { CdeService } from '../../../../../../../open-api-modules/monexcore-api-docs';
import { Store } from '@ngrx/store';
import * as fromSelectors from '../../../../../core/store/selectors';
import { FilterActionEventModel } from '../../../../../public/models/filter/filter-action-event.model';
import { PageEvent } from '@angular/material/paginator/public-api';
import { Sort } from '@angular/material/sort';
import { FilterEventModel } from '../../../../../public/models/filter/filter-event.model';
import { CustomApiResponse, PDGroup } from '../../../pd-system/pd-interface';
import * as fromStore from '../../../../../core/store';
import { TableActionButtonModel } from '../../../../../public/models/external/table-action-button.model';
import { OverviewItemModel } from '../../../../../public/models/external/overview-item.model';
import { ConfigContractListService } from './config-contract-list.service';

@Component({
  selector: 'app-config-contract-list',
  templateUrl: './config-contract-list.component.html',
  styleUrls: ['./config-contract-list.component.scss'],
})
export class ConfigContractListComponent implements OnInit {
  @ViewChild(BaseManagementLayoutComponent)
  child: BaseManagementLayoutComponent;

  allColumns: any[] = [
    {
      key: 'name',
      title: this.multiLanguageService.instant(
        'system.system_config.contract_template.name'
      ),
      type: DATA_CELL_TYPE.TEXT,
      format: null,
      showed: true,
    },
    {
      key: 'productId',
      title: this.multiLanguageService.instant(
        'system.system_config.contract_template.product_name'
      ),
      type: DATA_CELL_TYPE.TEXT,
      format: null,
      showed: true,
    },
    {
      key: 'active',
      title: this.multiLanguageService.instant(
        'system.system_config.contract_template.status'
      ),
      type: DATA_CELL_TYPE.TEXT,
      format: null,
      showed: true,
    },
    {
      key: 'createdAt',
      title: this.multiLanguageService.instant(
        'system.system_config.contract_template.created_at'
      ),
      type: DATA_CELL_TYPE.DATETIME,
      format: 'dd/MM/yyyy HH:mm',
      showed: false,
    },
  ];
  tableTitle: string = this.multiLanguageService.instant(
    'system.system_config.contract_template.title'
  );
  hasSelect: boolean = false;
  selectButtons: TableSelectActionModel[] = [];

  totalItems: number = 0;
  filterForm: FormGroup;
  dataSource: MatTableDataSource<any> = new MatTableDataSource([]);
  pages: Array<number>;
  pageSize: number = 10;
  pageIndex: number = 0;
  pageLength: number = 0;
  pageSizeOptions: number[] = [10, 20, 50];
  expandedElementId: number;
  subManager = new Subscription();
  hasActions: boolean = true;
  breadcrumbOptions: BreadcrumbOptionsModel = {
    title: this.multiLanguageService.instant('breadcrumb.contract_template'),
    iconImgSrc: 'assets/img/icon/group-7/svg/setting-green.svg',
    searchable: false,
    showBtnAdd: true,
    btnAddText: this.multiLanguageService.instant(
      'system.system_config.contract_template.add'
    ),
    keyword: '',
  };
  filterOptions: FilterOptionModel[] = [
    // {
    //   title: this.multiLanguageService.instant('filter.time'),
    //   type: FILTER_TYPE.DATETIME,
    //   controlName: 'createdAt',
    //   value: null,
    // },
  ];

  actionButtons: TableActionButtonModel[] = [
    {
      hidden: false,
      action: TABLE_ACTION_TYPE.VIEW,
      color: 'accent',
      tooltip: this.multiLanguageService.instant('common.view'),
      imageSrc: 'assets/img/icon/group-5/svg/eye.svg',
      style: 'background-color: rgba(255, 255, 255, 0.1);',
    },
    {
      hidden: false,
      action: TABLE_ACTION_TYPE.EDIT,
      color: 'accent',
      tooltip: this.multiLanguageService.instant('common.edit'),
      imageSrc: 'assets/img/icon/group-5/svg/edit-small.svg',
      style: 'background-color: rgba(255, 255, 255, 0.1);',
    },
    {
      hidden: false,
      action: TABLE_ACTION_TYPE.DELETE,
      color: 'accent',
      tooltip: this.multiLanguageService.instant('common.delete'),
      imageSrc: 'assets/img/icon/group-5/svg/trash-red.svg',
      style: 'background-color: rgba(255, 255, 255, 0.1);',
    },
  ];

  overviewItems: OverviewItemModel[] = [
    {
      field: this.multiLanguageService.instant(
        'system.system_config.contract_template.total'
      ),
      value: 0,
    },
  ];

  private readonly routeAllState$: Observable<Params>;

  constructor(
    private multiLanguageService: MultiLanguageService,
    private notificationService: NotificationService,
    private notifier: ToastrService,
    private formBuilder: FormBuilder,
    private router: Router,
    private dialog: MatDialog,
    private titleService: Title,
    private activatedRoute: ActivatedRoute,
    private configContractListService: ConfigContractListService,
    private cdeService: CdeService,
    private store: Store<fromStore.State>
  ) {
    this.routeAllState$ = store.select(fromSelectors.getRouterAllState);
    this._initFilterForm();
  }

  ngOnInit(): void {
    this._initSubscription();
  }

  private _initSubscription() {
    this.subManager.add(
      this.routeAllState$.subscribe((params) => {
        this._parseQueryParams(params?.queryParams);
        this._getContractTemplateList();
      })
    );
  }

  public onExpandElementChange(element: any) {
    this.openUpdateDialog(element);
  }

  public onFilterActionTrigger(event: FilterActionEventModel) {
    if (event.type === FILTER_ACTION_TYPE.FILTER_EXTRA_ACTION) {
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

  public onSubmitSearchForm(event) {
    this.filterForm.controls.keyword.setValue(event.keyword);
    this.pageIndex = 0;
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
    this.pageSize = params.pageSize || 10;
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

  public _getContractTemplateList() {
    const params = this._buildParams();
    this.configContractListService.getData(params).subscribe((data) => {
      this._parseData(data?.result);
      this.getOverviewData(data?.result);
    });
  }

  triggerDeselectUsers() {
    this.child.triggerDeselectUsers();
  }

  public refreshContent() {
    setTimeout(() => {
      this.triggerDeselectUsers();
      this._getContractTemplateList();
    }, 2000);
  }

  private _deleteById(id: string) {
    if (!id) {
      return;
    }
    this.subManager.add(
      this.cdeService
        .cdeControllerDeletePdGroup(parseInt(id), {})
        .subscribe((result: CustomApiResponse<PDGroup>) => {
          if (!result || result.responseCode !== RESPONSE_CODE.SUCCESS) {
            return this.notifier.error(
              JSON.stringify(result?.message),
              result?.errorCode
            );
          }
        })
    );
  }

  openUpdateDialog(info: PDGroup) {
    // const addGroupDialogRef = this.dialog.open(AddNewPdDialogComponent, {
    //   panelClass: 'custom-info-dialog-container',
    //   maxWidth: '1200px',
    //   width: '90%',
    //   data: {
    //     isPdGroup: true,
    //     dialogTitle: 'Chỉnh sửa nhóm câu hỏi',
    //     inputName: 'Tên nhóm câu hỏi',
    //     inputCode: 'Mã nhóm câu hỏi',
    //     listTitle: 'Danh sách câu hỏi',
    //     pdInfo: info,
    //     leftArr: leftArr,
    //     rightArr: rightArr,
    //   },
    // });
    // this.subManager.add(
    //   addGroupDialogRef.afterClosed().subscribe((result: any) => {
    //     if (result && result.type === BUTTON_TYPE.PRIMARY) {
    //
    //     }
    //   })
    // );
  }

  onClickBtnAdd(event) {
    // const addGroupDialogRef = this.dialog.open(AddNewPdDialogComponent, {
    //   panelClass: 'custom-info-dialog-container',
    //   maxWidth: '1200px',
    //   width: '90%',
    //   data: {
    //     isPdGroup: true,
    //     leftArr: this.questionList,
    //     dialogTitle: 'Thêm nhóm câu hỏi',
    //     inputName: 'Tên nhóm câu hỏi',
    //     inputCode: 'Mã nhóm câu hỏi',
    //     listTitle: 'Danh sách câu hỏi',
    //   },
    // });
    // this.subManager.add(
    //   addGroupDialogRef.afterClosed().subscribe((result: any) => {
    //     if (result && result.type === BUTTON_TYPE.PRIMARY) {
    //       let createRequest = this._bindingDialogData(result.data, 'create');
    //       let addRequest = this._bindingDialogData(result.data.addArr);
    //       this.sendCreateRequest(createRequest, addRequest);
    //     }
    //   })
    // );
  }

  getOverviewData(rawData) {
    this.overviewItems.find(
      (ele) =>
        ele.field ===
        this.multiLanguageService.instant(
          'system.system_config.contract_template.total'
        )
    ).value = rawData?.pagination?.total;
  }
}
