import {Component, EventEmitter, Input, OnInit, Output, TemplateRef} from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { BreadcrumbOptionsModel } from '../../../../public/models/breadcrumb-options.model';

export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  { position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H' },
  { position: 2, name: 'Helium', weight: 4.0026, symbol: 'He' },
  { position: 3, name: 'Lithium', weight: 6.941, symbol: 'Li' },
  { position: 4, name: 'Beryllium', weight: 9.0122, symbol: 'Be' },
  { position: 5, name: 'Boron', weight: 10.811, symbol: 'B' },
  { position: 6, name: 'Carbon', weight: 12.0107, symbol: 'C' },
  { position: 7, name: 'Nitrogen', weight: 14.0067, symbol: 'N' },
  { position: 8, name: 'Oxygen', weight: 15.9994, symbol: 'O' },
  { position: 9, name: 'Fluorine', weight: 18.9984, symbol: 'F' },
  { position: 10, name: 'Neon', weight: 20.1797, symbol: 'Ne' },
];

@Component({
  selector: 'app-base-management-layout',
  templateUrl: './base-management-layout.component.html',
  styleUrls: ['./base-management-layout.component.scss'],
})
export class BaseManagementLayoutComponent implements OnInit {
  @Input() detailElementTemplate: TemplateRef<any>;
  @Input() titlePage: string = 'Khách hàng mới';

  // @Input() allColumns: any[] = ['position', 'name', 'weight', 'symbol'];
  // @Input() dataSource = new MatTableDataSource(ELEMENT_DATA);
  @Input() allColumns: any[] = [];
  @Input() tableTitle: string;
  @Input() dataSource: MatTableDataSource<any> = new MatTableDataSource([]);
  @Input() pageSize: number = 5;
  @Input() pageIndex: number = 0;
  @Input() pageSizeOptions: number[] = [5, 10, 25, 100];
  @Input() totalItems: number = 0;
  @Input() pageLength: number = 0;
  @Input() orderBy: string;
  @Input() descending: boolean;
  @Input() breadcrumbOptions: BreadcrumbOptionsModel;

  @Output() onPageChanged = new EventEmitter<any>();
  @Output() onSortChange = new EventEmitter<any>();

  constructor() {}

  ngOnInit(): void {}

  clickBtnAdd(event) {
    console.log(event);
  }
  submitSearchForm(event) {
    console.log(event);
  }

  triggerPageChange(event) {
    this.onPageChanged.emit(event)
  }

  triggerSortChange(event) {
    this.onSortChange.emit(event)
  }
}
