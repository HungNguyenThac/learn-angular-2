import {
  Component,
  Input,
  OnInit,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { detailExpandAnimation } from '../../../../core/common/animations/detail-expand.animation';
import { Sort } from '@angular/material/sort';
import { LiveAnnouncer } from '@angular/cdk/a11y';

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

  @Input() dataSource: any;
  @Input() pageSizeOptions: number[];
  @Input() totalItems: number;
  @Input() pageIndex: number;
  @Input() pageSize: number;
  @Input() displayedColumns: string[];
  expandedElement: any;
  selectedFields: object[] = [];
  panelOpenState = false;

  constructor(private _liveAnnouncer: LiveAnnouncer) {}

  ngOnInit(): void {
    for (let i = 0; i < this.displayedColumns.length; i++) {
      this.selectedFields.push({});
      this.selectedFields[i]['fieldName'] = this.displayedColumns[i];
      this.selectedFields[i]['fieldState'] = true;
    }
  }

  /** Announce the change in sort state for assistive technology. */
  announceSortChange(sortState: Sort) {
    // This example uses English messages. If your application supports
    // multiple language, you would internationalize these strings.
    // Furthermore, you can customize the message to add additional
    // details about the values being sorted.
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }

  setPage(i, event: any) {
    this.pageIndex = i;
    event.preventDefault();
    // this.getAllPermits();
  }

  updateDisplayColumns(selectedField) {
    selectedField.fieldState = !selectedField.fieldState;
    this.displayedColumns = [];
    for (let i = 0; i < this.selectedFields.length; i++) {
      if (this.selectedFields[i]['fieldState']) {
        this.displayedColumns.push(this.selectedFields[i]['fieldName']);
      }
    }
  }
}
