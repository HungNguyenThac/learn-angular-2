import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  TemplateRef,
} from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { BreadcrumbOptionsModel } from '../../../../public/models/breadcrumb-options.model';
import {SortDirection} from "@angular/material/sort/sort-direction";

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
  @Input() pageSize: number = 5;
  @Input() pageIndex: number = 0;
  @Input() pageSizeOptions: number[] = [5, 10, 25, 100];
  @Input() totalItems: number = 0;
  @Input() pageLength: number = 0;
  @Input() orderBy: string;
  @Input() sortDirection: SortDirection = 'desc';
  @Input() breadcrumbOptions: BreadcrumbOptionsModel;

  @Output() onPageChange = new EventEmitter<any>();
  @Output() onSortChange = new EventEmitter<any>();
  @Output() onExpandElementChange = new EventEmitter<any>();
  @Output() onClickBtnAdd = new EventEmitter<any>();
  @Output() onSubmitSearchForm = new EventEmitter<any>();

  constructor() {}

  ngOnInit(): void {}

  clickBtnAdd(event) {
    this.onClickBtnAdd.emit(event);
  }
  submitSearchForm(event) {
    this.onSubmitSearchForm.emit(event);
  }

  triggerPageChange(event) {
    this.onPageChange.emit(event);
  }

  triggerSortChange(event) {
    this.onSortChange.emit(event);
  }

  triggerExpandElementChange(event) {
    this.onExpandElementChange.emit(event);
  }
}
