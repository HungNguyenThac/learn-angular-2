import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  TemplateRef,
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
  @Input() hasSelect: boolean;
  @Input() sortDirection: SortDirection;
  @Input() allColumns: any[];
  @Output() triggerPageChange = new EventEmitter<any>();
  @Output() triggerSortChange = new EventEmitter<any>();
  @Output() triggerExpandedElementChange = new EventEmitter<any>();

  expandedElement: any;
  selectedFields: DisplayedFieldsModel[] = [];
  panelOpenState = false;
  selection = new SelectionModel<PeriodicElement>(true, []);
  displayColumn;
  arrDisplayColumn;

  constructor(private _liveAnnouncer: LiveAnnouncer) {
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

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: PeriodicElement): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${
      row.position + 1
    }`;
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
}
