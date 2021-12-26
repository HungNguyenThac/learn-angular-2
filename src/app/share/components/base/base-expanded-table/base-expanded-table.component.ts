import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  OnInit,
  Output,
  Renderer2,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { detailExpandAnimation } from '../../../../core/common/animations/detail-expand.animation';
import { Sort } from '@angular/material/sort';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { DisplayedFieldsModel } from '../../../../public/models/filter/displayed-fields.model';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { PageEvent } from '@angular/material/paginator/public-api';
import { SortDirection } from '@angular/material/sort/sort-direction';
import { SelectionModel } from '@angular/cdk/collections';
import { PeriodicElement } from '../../../../pages/dashboard/dashboard.component';
import { MultiLanguageService } from '../../../translate/multiLanguageService';
import { NotificationService } from '../../../../core/services/notification.service';
import { ToastrService } from 'ngx-toastr';
import { TableSelectActionModel } from '../../../../public/models/external/table-select-action.model';
import * as _ from 'lodash';

@Component({
  selector: 'app-base-expanded-table',
  templateUrl: './base-expanded-table.component.html',
  styleUrls: ['./base-expanded-table.component.scss'],
  animations: [
    detailExpandAnimation,
    // animation triggers go here
  ],
})
export class BaseExpandedTableComponent implements OnInit, AfterViewInit {
  @ViewChild(MatTable, { read: ElementRef }) private matTableRef: ElementRef;

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
  @Input() allColumns: DisplayedFieldsModel[];
  @Input() hasSelect: boolean;
  @Input() selectButtons: TableSelectActionModel[];
  _expandElementByDefault;
  @Input() get expandElementByDefault() {
    return this._expandElementByDefault;
  }

  set expandElementByDefault(value) {
    this._expandElementByDefault = value;
    if (this._expandElementByDefault) {
      this.expandElement(this._expandElementByDefault);
    }
  }

  @Output() triggerPageChange = new EventEmitter<any>();
  @Output() triggerSortChange = new EventEmitter<any>();
  @Output() triggerExpandedElementChange = new EventEmitter<any>();
  @Output() outputAction = new EventEmitter<any>();

  pressed: boolean = false;
  currentResizeIndex: number;
  startX: number;
  startWidth: number;
  isResizingRight: boolean;
  resizableMousemove: () => void;
  resizableMouseup: () => void;

  expandedElement: any;
  selectedFields: DisplayedFieldsModel[] = [];
  panelOpenState = false;
  selection = new SelectionModel<PeriodicElement>(true, []);
  displayColumns: DisplayedFieldsModel[] = [];
  displayColumnKeys: string[] = [];

  constructor(
    private multiLanguageService: MultiLanguageService,
    private notificationService: NotificationService,
    private notifier: ToastrService,
    private _liveAnnouncer: LiveAnnouncer,
    private renderer: Renderer2,
    private cdr: ChangeDetectorRef
  ) {}

  get numSelected() {
    return this.selection.selected.length;
  }

  get showSelectedPanel() {
    return this.selection.selected.length !== 0;
  }

  displayedColumns() {
    this.displayColumns =
      this.selectedFields.filter((element) => element.showed === true) || [];
  }

  displayedColumnKeys() {
    this.displayColumnKeys = this.displayColumns.map((item, index) => {
      return item.key;
    });
    if (this.hasSelect) {
      this.displayColumnKeys.unshift('select');
    }
  }

  changeFilter(ele) {
    ele.showed = !ele.showed;
    this.displayedColumns();
    this.displayedColumnKeys();
    this.setTableResize(this.matTableRef.nativeElement.clientWidth);
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
    this.displayedColumns();
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
    this.displayedColumns();
    this.displayedColumnKeys();
    this.setTableResize(this.matTableRef.nativeElement.clientWidth);
  }

  private _initSelectedFields() {
    this.selectedFields = this.allColumns.map((item, index) => {
      return {
        key: item.key,
        title: item.title,
        type: item.type,
        width: item.width || 100,
        format: item.format,
        showed: item.showed,
        externalKey: item.externalKey,
      };
    });
  }

  onClick(action) {
    this.outputAction.emit({
      action: action,
      selectedList: this.selection.selected,
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

  setTableResize(tableWidth: number) {
    const columnEls = Array.from(
      this.matTableRef.nativeElement.getElementsByClassName(
        'mat-column-firstName'
      )
    );

    console.log('columnEls', columnEls);

    let totWidth = 0;
    this.displayColumns.forEach((column) => {
      totWidth += column.width;
    });
    const scale = (tableWidth - 5) / totWidth;
    this.displayColumns.forEach((column) => {
      column.width *= scale;
      this.setColumnWidth(column);
    });
    this.cdr.detectChanges();
  }

  onResizeColumn(event: any, index: number) {
    console.log('checkResizing', event, index);
    this.checkResizing(event, index);
    this.currentResizeIndex = index;
    this.pressed = true;
    this.startX = event.pageX;
    this.startWidth = event.target.clientWidth;
    console.log('this.startWidth', this.startWidth);
    event.preventDefault();
    this.mouseMove(index);
  }

  private checkResizing(event, index) {
    const cellData = this.getCellData(index);
    this.isResizingRight =
      index === 0 ||
      (Math.abs(event.pageX - cellData.right) < cellData.width / 2 &&
        index !== this.displayColumns.length - 1);
  }

  private getCellData(index: number) {
    const headerRow =
      this.matTableRef.nativeElement.children[0].querySelector('tr');
    const cell = headerRow.children[index];
    return cell.getBoundingClientRect();
  }

  mouseMove(index: number) {
    this.resizableMousemove = this.renderer.listen(
      'document',
      'mousemove',
      (event) => {
        if (this.pressed && event.buttons) {
          const dx = this.isResizingRight
            ? event.pageX - this.startX
            : -event.pageX + this.startX;
          const width = this.startWidth + dx;
          console.log('width', width);
          console.log('this.currentResizeIndex', this.currentResizeIndex);
          console.log('index', index);
          console.log(
            'this.currentResizeIndex === index && width > 50',
            this.currentResizeIndex === index && width > 50
          );
          if (this.currentResizeIndex === index && width > 50) {
            this.setColumnWidthChanges(index, width);
          }
        }
      }
    );
    this.resizableMouseup = this.renderer.listen(
      'document',
      'mouseup',
      (event) => {
        if (this.pressed) {
          this.pressed = false;
          this.currentResizeIndex = -1;
          this.resizableMousemove();
          this.resizableMouseup();
        }
      }
    );
  }

  setColumnWidthChanges(index: number, width: number) {
    const orgWidth = this.displayColumns[index].width;
    const dx = width - orgWidth;
    if (dx && dx !== 0) {
      const j = this.isResizingRight ? index + 1 : index - 1;
      const newWidth = this.displayColumns[j].width - dx;
      if (newWidth > 50) {
        this.displayColumns[index].width = width;
        this.setColumnWidth(this.displayColumns[index]);
        this.displayColumns[j].width = newWidth;
        this.setColumnWidth(this.displayColumns[j]);
      }
    }
  }

  setColumnWidth(column: DisplayedFieldsModel) {
    const columnEls = Array.from(
      this.matTableRef.nativeElement.getElementsByClassName(
        'mat-column-' + column.key.replace(/\./g, '-')
      )
    );

    console.log('columnEls', columnEls);
    columnEls.forEach((el: HTMLDivElement) => {
      el.style.width = column.width + 'px';
      console.log(el.style.width);
    });
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.setTableResize(this.matTableRef.nativeElement.clientWidth);
  }

  ngAfterViewInit(): void {
    this.setTableResize(this.matTableRef.nativeElement.clientWidth);
  }

}
