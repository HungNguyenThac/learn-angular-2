import { DialogEkycInfoDetailComponent } from './../dialog-ekyc-info-detail/dialog-ekyc-info-detail.component';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { ApiResponseSearchAndPaginationResponseKalapaResponse } from './../../../../../../../open-api-modules/dashboard-api-docs/model/apiResponseSearchAndPaginationResponseKalapaResponse';
import { EkycControllerService } from './../../../../../../../open-api-modules/dashboard-api-docs/api/ekycController.service';
import {
  DATA_CELL_TYPE,
  DATA_STATUS_TYPE,
} from './../../../../../core/common/enum/operator';
import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  TemplateRef,
} from '@angular/core';
import { Sort } from '@angular/material/sort';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { MatTableDataSource } from '@angular/material/table';
import { PageEvent } from '@angular/material/paginator/public-api';
import { SortDirection } from '@angular/material/sort/sort-direction';
import { MultiLanguageService } from '../../../../translate/multiLanguageService';
import { NotificationService } from '../../../../../core/services/notification.service';
import { ToastrService } from 'ngx-toastr';
import * as _ from 'lodash';

@Component({
  selector: 'app-customer-check-info',
  templateUrl: './customer-check-info.component.html',
  styleUrls: ['./customer-check-info.component.scss'],
})
export class CustomerCheckInfoComponent implements OnInit {
  dataSource: MatTableDataSource<any> = new MatTableDataSource([]);
  pageSize: number = 10;
  pageIndex: number = 0;
  pageLength: number = 0;
  pageSizeOptions: number[] = [10, 20, 50];
  totalItems: number = 0;
  subManager = new Subscription();
  @Input() customerId: string;
  orderBy: string;
  sortDirection: SortDirection;
  @Output() outputAction = new EventEmitter<any>();

  displayColumn = [
    {
      key: 'createdAt',
      title: this.multiLanguageService.instant(
        'loan_app.loan_info.register_at'
      ),
      type: DATA_CELL_TYPE.DATETIME,
      format: 'dd/MM/yyyy HH:mm:ss',
      showed: true,
    },
    {
      key: 'status',
      title: this.multiLanguageService.instant(
        'customer.customer_check_info.status'
      ),
      type: DATA_CELL_TYPE.STATUS,
      format: DATA_STATUS_TYPE.PL_OTHER_STATUS,
      showed: true,
    },
  ];

  displayColumnRowDef: string[];

  constructor(
    private multiLanguageService: MultiLanguageService,
    private notificationService: NotificationService,
    private notifier: ToastrService,
    private _liveAnnouncer: LiveAnnouncer,
    private ekycControllerService: EkycControllerService,
    private dialog: MatDialog
  ) {
    this.displayColumnRowDef = this.displayColumn.map((ele) => ele.key);
    console.log('this.displayColumnRowDef', this.displayColumnRowDef);
  }

  ngOnInit(): void {
    this._getEkycList();
  }

  private _getEkycList() {
    let requestBody = {};
    requestBody['customerId'] = this.customerId;
    this.subManager.add(
      this.ekycControllerService
        .getEkycInfo(
          this.pageSize,
          this.pageIndex,
          requestBody,
          this.orderBy,
          this.sortDirection === 'desc'
        )
        .subscribe(
          (data: ApiResponseSearchAndPaginationResponseKalapaResponse) => {
            this.dataSource.data = data.result.data;
            this.pageLength = data.result?.pagination?.maxPage || 0;
            this.totalItems = data.result?.pagination?.total || 0;
          }
        )
    );
  }

  /** Announce the change in sort state for assistive technology. */
  public announceSortChange(sortState: Sort) {
    // This example uses English messages. If your application supports
    // multiple language, you would internationalize these strings.
    // Furthermore, you can customize the message to add additional
    // details about the values being sorted.
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
    this.orderBy = sortState.active;
    this.sortDirection = sortState.direction;
    this._getEkycList();
  }

  public onPageChange(event: PageEvent) {
    this.pageSize = event.pageSize;
    this.pageIndex = event.pageIndex;
    this._getEkycList();
  }

  openDialogDetailEkyc(element) {
    console.log(element);
    this.dialog.open(DialogEkycInfoDetailComponent, {
      panelClass: 'custom-info-dialog-container',
      maxWidth: '800px',
      width: '60%',
      data: {
        data: element,
      },
    });
  }

  getPropByString(obj, propString) {
    if (!propString || !obj) return null;

    var prop,
      props = propString.split('.');

    for (var i = 0, iLen = props.length - 1; i < iLen; i++) {
      prop = props[i];

      var candidate = obj[prop];

      if (!_.isEmpty(candidate)) {
        obj = candidate;
      } else {
        break;
      }
    }

    return obj[props[i]];
  }
}
