import { DATA_CELL_TYPE, DATA_STATUS_TYPE } from './../../../../../core/common/enum/operator';
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
  @Input() orderBy: string;
  @Input() sortDirection: SortDirection;
  @Output() triggerPageChange = new EventEmitter<any>();
  @Output() triggerSortChange = new EventEmitter<any>();
  @Output() triggerExpandedElementChange = new EventEmitter<any>();
  @Output() outputAction = new EventEmitter<any>();

  displayColumn = [
    {
      key: 'createdAt',
      title: this.multiLanguageService.instant(
        'loan_app.loan_info.register_at'
      ),
      type: DATA_CELL_TYPE.DATETIME,
      format: 'dd/MM/yyyy HH:mm',
      showed: true,
    },
    {
      key: 'status',
      title: this.multiLanguageService.instant(
        'customer.customer_check_info.status'
      ),
      type: DATA_CELL_TYPE.STATUS,
      format: DATA_STATUS_TYPE.PL_HMG_STATUS,
      showed: true,
    },
  ];

  displayColumnRowDef: string[];

  constructor(
    private multiLanguageService: MultiLanguageService,
    private notificationService: NotificationService,
    private notifier: ToastrService,
    private _liveAnnouncer: LiveAnnouncer
  ) {
    this.dataSource.data = [
      { createdAt: new Date(), status: 'success' },
      { createdAt: new Date(), status: 'fail' },
    ];
    this.displayColumnRowDef = this.displayColumn.map((ele) => ele.key);
    console.log('this.displayColumnRowDef', this.displayColumnRowDef);
  }

  ngOnInit(): void {}

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

    this.triggerSortChange.emit(sortState);
  }

  public setPage(i, event: any) {
    this.pageIndex = i;
    event.preventDefault();
  }

  public onPageChange(event: PageEvent) {
    this.triggerPageChange.emit(event);
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
