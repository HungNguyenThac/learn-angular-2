import {
  ChangeDetectorRef,
  Component,
  Input,
  OnInit,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { detailExpandAnimation } from '../../../../core/common/animations/detail-expand.animation';
import { Sort } from '@angular/material/sort';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { DisplayedFieldsModel } from '../../../../public/models/displayed-fields.model';
import { MatTableDataSource } from '@angular/material/table';

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
  @Input() allColumns: any[];

  expandedElement: any;
  selectedFields: DisplayedFieldsModel[] = [];
  panelOpenState = false;

  get displayedColumns() {
    return (
      this.selectedFields.filter((element) => element.showed === true) || []
    );
  }

  get displayedColumnKeys() {
    return this.displayedColumns.map((item, index) => {
      return item.key;
    });
  }

  constructor(
    private _liveAnnouncer: LiveAnnouncer,
    private changeDetectorRef: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.selectedFields = this.allColumns.map((item, index) => {
      return {
        key: item.key,
        title: item.title,
        type: item.type,
        format: item.format,
        showed: true,
      };
    });
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
  }
}
