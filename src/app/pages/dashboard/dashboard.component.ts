import { MatDialog } from '@angular/material/dialog';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { Color, Label, MultiDataSet } from 'ng2-charts';
import { ChartDataSets, ChartType } from 'chart.js';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { FormControl, FormBuilder, FormGroup } from '@angular/forms';
import { GlobalConstants } from '../../core/common/global-constants';
import { Title } from '@angular/platform-browser';
import { Store } from '@ngrx/store';
import * as fromStore from '../../core/store';
import * as fromActions from '../../core/store';
import { MultiLanguageService } from '../../share/translate/multiLanguageService';
import { NAV_ITEM } from '../../core/common/enum/operator';

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
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit, AfterViewInit {
  doughnutChartLabels: Label[] = ['Ứng lương', 'Đầu tư', 'Bảo hiểm'];
  doughnutChartData: MultiDataSet = [[55, 25, 20]];
  doughnutChartType: ChartType = 'doughnut';

  lineChartData: ChartDataSets[] = [
    { data: [85, 72, 78, 75, 77, 75], label: 'Khách hàng mới' },
  ];

  lineChartLabels: Label[] = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
  ];

  lineChartOptions = {
    responsive: true,
  };

  lineChartColors: Color[] = [
    {
      borderColor: 'black',
      backgroundColor: 'rgba(201,253,219,0.28)',
    },
  ];

  lineChartLegend = true;
  lineChartPlugins = [];
  lineChartType = 'line';

  displayedColumns: string[] = ['position', 'name', 'weight', 'symbol'];
  dataSource = new MatTableDataSource(ELEMENT_DATA);

  fieldsName: Array<string> = [];
  panelOpenState = false;
  fieldsControl: FormGroup;

  pages: Array<number>;
  pageSize: number = 5;
  pageIndex: number = 0;
  pageSizeOptions: number[] = [5, 10, 25, 100];
  totalItems: number = 0;

  constructor(
    private _liveAnnouncer: LiveAnnouncer,
    public matDialog: MatDialog,
    public formBuilder: FormBuilder,
    private titleService: Title,
    private store: Store<fromStore.State>,
    private multiLanguageService: MultiLanguageService
  ) {
    this.pages = new Array(Math.round(this.totalItems / this.pageSize));
    this.fieldsName = this.displayedColumns.slice();
    const controlsConfig = {};
    for (let i = 0; i < this.fieldsName.length; i++) {
      const fieldName = this.fieldsName[i];
      controlsConfig[fieldName] = true;
    }
    this.fieldsControl = formBuilder.group(controlsConfig);
  }
  @ViewChild(MatSort) sort: MatSort;

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }

  ngOnInit(): void {
    this.titleService.setTitle(
      this.multiLanguageService.instant('page_title.dashboard') +
        ' - ' +
        GlobalConstants.PL_VALUE_DEFAULT.PROJECT_NAME
    );
    this.store.dispatch(new fromActions.SetOperatorInfo(NAV_ITEM.DASHBOARD));
    this.totalItems = ELEMENT_DATA.length;
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

  updateDisplayColumns() {
    this.displayedColumns = [];
    for (let i = 0; i < this.fieldsName.length; i++) {
      if (this.fieldsControl.controls[this.fieldsName[i]].value) {
        this.displayedColumns.push(this.fieldsName[i]);
      }
    }
  }

  resetDisplayColumn() {
    for (let i = 0; i < this.fieldsName.length; i++) {
      this.fieldsControl.controls[this.fieldsName[i]].setValue(true);
    }
    this.displayedColumns = this.fieldsName;
  }
}
