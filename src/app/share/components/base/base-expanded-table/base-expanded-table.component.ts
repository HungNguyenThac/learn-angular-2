import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import {detailExpandAnimation} from '../../../../core/common/animations/detail-expand.animation';
import {Sort} from '@angular/material/sort';
import {LiveAnnouncer} from '@angular/cdk/a11y';
import {DisplayedFieldsModel} from '../../../../public/models/filter/displayed-fields.model';
import {MatTableDataSource} from '@angular/material/table';
import {PageEvent} from '@angular/material/paginator/public-api';
import {SortDirection} from '@angular/material/sort/sort-direction';
import {SelectionModel} from '@angular/cdk/collections';
import {PeriodicElement} from '../../../../pages/dashboard/dashboard.component';
import {MultiLanguageService} from '../../../translate/multiLanguageService';
import {NotificationService} from '../../../../core/services/notification.service';
import {ToastrService} from 'ngx-toastr';
import {TableSelectActionModel} from '../../../../public/models/external/table-select-action.model';
import {MatCheckbox} from '@angular/material/checkbox';

@Component({
  selector: 'app-base-expanded-table',
  templateUrl: './base-expanded-table.component.html',
  styleUrls: ['./base-expanded-table.component.scss'],
  animations: [
    detailExpandAnimation,
    // animation triggers go here
  ],
})
export class BaseExpandedTableComponent implements OnInit {
  @Input() detailElementTemplate: TemplateRef<any>;
  @Input() tableTitle: string;
  @Input() dataSource: MatTableDataSource<any>;
  @Input() pageSizeOptions: number[];
  @Input() totalItems: number;
  @Input() pageLength: number;
  @Input() pageIndex: number;
  @Input() pageSize: number;
  @Input() orderBy: string;
  @Input() sortDirection: SortDirection;
  @Input() allColumns: any[];
  @Input() hasSelect: boolean;
  @Input() selectButtons: TableSelectActionModel[];
  @Output() triggerPageChange = new EventEmitter<any>();
  @Output() triggerSortChange = new EventEmitter<any>();
  @Output() triggerExpandedElementChange = new EventEmitter<any>();
  @Output() outputAction = new EventEmitter<any>();

  expandedElement: any;
  selectedFields: DisplayedFieldsModel[] = [];
  panelOpenState = false;
  selection = new SelectionModel<PeriodicElement>(true, []);
  displayColumn;
  arrDisplayColumn;

  constructor(
    private multiLanguageService: MultiLanguageService,
    private notificationService: NotificationService,
    private notifier: ToastrService,
    private _liveAnnouncer: LiveAnnouncer
  ) {
  }

  get numSelected() {
    return this.selection.selected.length;
  }

  get showSelectedPanel() {
    return this.selection.selected.length !== 0;
  }

  displayedColumns() {
    this.displayColumn =
      this.selectedFields.filter((element) => element.showed === true) || [];
  }

  displayedColumnKeys() {
    this.arrDisplayColumn = this.displayColumn.map((item, index) => {
      return item.key;
    });
    if (this.hasSelect) {
      this.arrDisplayColumn.unshift('select');
    }
  }

  changeFilter(ele) {
    ele.showed = !ele.showed;
    this.displayedColumns();
    this.displayedColumnKeys();
  }

  deselectAll() {
    this.selection.clear();
    return;
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }
    this.selection.select(...this.dataSource.data);
  }

  ngOnInit(): void {
    this._initSelectedFields();
    this.displayedColumnKeys();
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

    this.triggerSortChange.emit(sortState);
  }

  public setPage(i, event: any) {
    this.pageIndex = i;
    event.preventDefault();
  }

  public onPageChange(event: PageEvent) {
    this.triggerPageChange.emit(event);
  }

  public expandElement(element) {
    console.log('expandElement', element);
    this.expandedElement = this.expandedElement === element ? null : element;
    this.triggerExpandedElementChange.emit(element);
  }

  public resetDisplayFields() {
    this._initSelectedFields();
  }

  private _initSelectedFields() {
    this.selectedFields = this.allColumns.map((item, index) => {
      return {
        key: item.key,
        title: item.title,
        type: item.type,
        format: item.format,
        showed: item.showed,
      };
    });
    this.displayedColumns();
  }

  onClick(action) {
    this.outputAction.emit({
      action: action,
      selectedList: this.selection.selected,
    });
  }
}
