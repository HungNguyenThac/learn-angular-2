import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { BreadcrumbOptionsModel } from '../../../../public/models/external/breadcrumb-options.model';
import { SortDirection } from '@angular/material/sort/sort-direction';
import { FilterOptionModel } from '../../../../public/models/filter/filter-option.model';
import { FilterEventModel } from '../../../../public/models/filter/filter-event.model';
import { FilterActionEventModel } from '../../../../public/models/filter/filter-action-event.model';
import { Sort } from '@angular/material/sort';
import { PageEvent } from '@angular/material/paginator/public-api';
import { TableSelectActionModel } from '../../../../public/models/external/table-select-action.model';
import { BaseExpandedTableComponent } from '../base-expanded-table/base-expanded-table.component';

@Component({
  selector: 'app-base-management-layout',
  templateUrl: './base-management-layout.component.html',
  styleUrls: ['./base-management-layout.component.scss'],
})
export class BaseManagementLayoutComponent implements OnInit {
  @Input() detailElementTemplate: TemplateRef<any>;
  @Input() allColumns: any[] = [];
  @Input() tableTitle: string;
  @Input() dataSource: MatTableDataSource<any> = new MatTableDataSource([]);
  @Input() pageSize: number = 10;
  @Input() pageIndex: number = 0;
  @Input() pageSizeOptions: number[] = [10, 20, 50];
  @Input() totalItems: number = 0;
  @Input() pageLength: number = 0;
  @Input() orderBy: string;
  @Input() hasSelect: boolean;
  @Input() selectButtons: TableSelectActionModel[] = [];
  @Input() sortDirection: SortDirection = 'desc';
  @Input() forceExpandElement: any;
  @Output() onPageChange = new EventEmitter<PageEvent>();
  @Output() onSortChange = new EventEmitter<Sort>();
  @Output() onExpandElementChange = new EventEmitter<any>();
  @Output() onClickBtnAdd = new EventEmitter<any>();
  @Output() onSubmitSearchForm = new EventEmitter<any>();
  @Output() onFilterChange = new EventEmitter<FilterEventModel>();
  @Output() onFilterActionTrigger = new EventEmitter<FilterActionEventModel>();
  @Output() onOutputAction = new EventEmitter<any>();

  @ViewChild(BaseExpandedTableComponent) child: BaseExpandedTableComponent;

  triggerDeselectUsers() {
    this.child.deselectAll();
  }

  constructor() {}

  _filterOptions: FilterOptionModel[] = [];
  @Input() get filterOptions(): FilterOptionModel[] {
    return this._filterOptions;
  }

  set filterOptions(value) {
    this._filterOptions = value;
  }

  _breadcrumbOptions: BreadcrumbOptionsModel;

  @Input() get breadcrumbOptions(): BreadcrumbOptionsModel {
    return this._breadcrumbOptions;
  }

  set breadcrumbOptions(value) {
    this._breadcrumbOptions = value;
  }

  ngOnInit(): void {}

  clickBtnAdd(event) {
    this.onClickBtnAdd.emit(event);
  }

  submitSearchForm(event) {
    this.onSubmitSearchForm.emit(event);
  }

  triggerPageChange(event: PageEvent) {
    this.onPageChange.emit(event);
  }

  triggerSortChange(event: Sort) {
    this.onSortChange.emit(event);
  }

  triggerExpandElementChange(event) {
    this.onExpandElementChange.emit(event);
  }

  triggerFilterChange(event: FilterEventModel) {
    this.onFilterChange.emit(event);
  }

  triggerFilterAction(event: FilterActionEventModel) {
    this.onFilterActionTrigger.emit(event);
  }

  outputAction(event: Sort) {
    this.onOutputAction.emit(event);
  }
}
