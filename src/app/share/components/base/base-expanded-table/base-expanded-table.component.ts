import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-base-expanded-table',
  templateUrl: './base-expanded-table.component.html',
  styleUrls: ['./base-expanded-table.component.scss'],
})
export class BaseExpandedTableComponent implements OnInit {
  @Input() dataSource: any;
  @Input() pageSizeOptions: number[];
  @Input() totalItems: number;
  @Input() pageIndex: number;
  @Input() pageSize: number;
  @Input() displayedColumns: string[];
  expandedElement: any;

  constructor() {}

  ngOnInit(): void {}
}
