import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import * as moment from 'moment';
import {
  DateAdapter,
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE,
} from '@angular/material/core';
import {
  MAT_MOMENT_DATE_FORMATS,
  MomentDateAdapter,
} from '@angular/material-moment-adapter';
import { MultiLanguageService } from '../../../translate/multiLanguageService';
import { FilterEventModel } from '../../../../public/models/filter-event.model';
import { FilterOptionModel } from '../../../../public/models/filter-option.model';

@Component({
  selector: 'app-datetime-filter',
  templateUrl: './datetime-filter.component.html',
  styleUrls: ['./datetime-filter.component.scss'],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'vi-VN' },
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE],
    },
    { provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS },
  ],
})
export class DatetimeFilterComponent implements OnInit {
  @Input() filterOption: FilterOptionModel;

  @Output() completeFilter = new EventEmitter<FilterEventModel>();

  currentTime = new Date();
  currentQuarter = Math.floor((this.currentTime.getMonth() + 3) / 3);

  timeFilterOptions: any = [
    {
      mainTitle: this.multiLanguageService.instant('filter.options.by_day'),
      options: [
        {
          title: this.multiLanguageService.instant('filter.options.to_day'),
          startDate: this.today.startDate,
          endDate: this.today.endDate,
        },
        {
          title: this.multiLanguageService.instant('filter.options.yesterday'),
          startDate: this.yesterday.startDate,
          endDate: this.yesterday.endDate,
        },
      ],
    },
    {
      mainTitle: this.multiLanguageService.instant('filter.options.by_week'),
      options: [
        {
          title: this.multiLanguageService.instant('filter.options.this_week'),
          startDate: this.currentWeek.startDate,
          endDate: this.currentWeek.endDate,
        },
        {
          title: this.multiLanguageService.instant('filter.options.last_week'),
          startDate: this.lastWeek.startDate,
          endDate: this.lastWeek.endDate,
        },
        {
          title: this.multiLanguageService.instant(
            'filter.options.last_7_days'
          ),
          startDate: this.last7days.startDate,
          endDate: this.last7days.endDate,
        },
      ],
    },
    {
      mainTitle: this.multiLanguageService.instant('filter.options.by_month'),
      options: [
        {
          title: this.multiLanguageService.instant('filter.options.this_month'),
          startDate: this.currentMonth.startDate,
          endDate: this.currentMonth.endDate,
        },
        {
          title: this.multiLanguageService.instant('filter.options.last_month'),
          startDate: this.lastMonth.startDate,
          endDate: this.lastMonth.endDate,
        },
        {
          title: this.multiLanguageService.instant(
            'filter.options.last_30_days'
          ),
          startDate: this.last30days.startDate,
          endDate: this.last30days.endDate,
        },
      ],
    },
    {
      mainTitle: this.multiLanguageService.instant(
        'filter.options.by_quarterly'
      ),
      options: [
        {
          title: this.multiLanguageService.instant(
            'filter.options.first_quarterly'
          ),
          startDate: this.firstQuarter.startDate,
          endDate: this.firstQuarter.endDate,
        },
        {
          title: this.multiLanguageService.instant(
            'filter.options.second_quarterly'
          ),
          startDate: this.secondQuarter.startDate,
          endDate: this.secondQuarter.endDate,
        },
        {
          title: this.multiLanguageService.instant(
            'filter.options.third_quarterly'
          ),
          startDate: this.thirdQuarter.startDate,
          endDate: this.thirdQuarter.endDate,
        },
        {
          title: this.multiLanguageService.instant(
            'filter.options.fourth_quarterly'
          ),
          startDate: this.fourthQuarter.startDate,
          endDate: this.fourthQuarter.endDate,
        },
      ],
    },
    {
      mainTitle: this.multiLanguageService.instant('filter.options.by_year'),
      options: [
        {
          title: this.multiLanguageService.instant('filter.options.this_year'),
          startDate: this.currentYear.startDate,
          endDate: this.currentYear.endDate,
        },
        {
          title: this.multiLanguageService.instant('filter.options.last_year'),
          startDate: this.lastYear.startDate,
          endDate: this.lastYear.endDate,
        },
        {
          title: this.multiLanguageService.instant('filter.options.all_time'),
          startDate: null,
          endDate: this.today.endDate,
        },
      ],
    },
  ];
  chooseTimeFilterMethod: number;
  choosenStaticMethod: string =
    this.multiLanguageService.instant('filter.all_time');
  choosenStateMethod: string = this.multiLanguageService.instant(
    'filter.choose_range_time'
  );
  selectedStartDate: Date | null;
  selectedEndDate: Date | null = this.currentTime;

  constructor(private multiLanguageService: MultiLanguageService) {}

  ngOnInit(): void {}

  formatTime(time) {
    if (!time) return;
    return moment(new Date(time), 'YYYY-MM-DD HH:mm:ss').format(
      'DD-MM-YYYY HH:mm'
    );
  }

  startDate(time) {
    return this.formatTime(moment(time).set({ h: 0, m: 0, s: 0 }));
  }

  endDate(time) {
    return this.formatTime(moment(time).set({ h: 23, m: 59, s: 59 }));
  }

  get today() {
    const startDate = this.startDate(this.currentTime);
    const endDate = this.formatTime(this.currentTime);
    return { startDate, endDate };
  }

  get yesterday() {
    const timeOption = new Date().setDate(this.currentTime.getDate() - 1);
    const startDate = this.startDate(timeOption);
    const endDate = this.endDate(timeOption);
    return { startDate, endDate };
  }

  get currentWeek() {
    const firstDayOfWeek =
      this.currentTime.getDate() - this.currentTime.getDay() + 1;
    const timeOptionStart = new Date().setDate(firstDayOfWeek);
    const startDate = this.startDate(timeOptionStart);
    const endDate = this.formatTime(this.currentTime);
    return { startDate, endDate };
  }

  get lastWeek() {
    const firstDayOfLastWeek =
      this.currentTime.getDate() - this.currentTime.getDay() - 6;
    const timeOptionStart = new Date().setDate(firstDayOfLastWeek);
    const lastDayOfLastWeek =
      this.currentTime.getDate() - this.currentTime.getDay();
    const timeOptionEnd = new Date().setDate(lastDayOfLastWeek);
    const startDate = this.startDate(timeOptionStart);
    const endDate = this.endDate(timeOptionEnd);
    return { startDate, endDate };
  }

  get last7days() {
    const firstDay = this.currentTime.getDate() - 7;
    const timeOptionStart = new Date().setDate(firstDay);
    const startDate = this.formatTime(timeOptionStart);
    const endDate = this.formatTime(this.currentTime);
    return { startDate, endDate };
  }

  get currentMonth() {
    const timeOptionStart = new Date(new Date().setDate(1));
    const startDate = this.startDate(timeOptionStart);
    const endDate = this.formatTime(this.currentTime);
    return { startDate, endDate };
  }

  get lastMonth() {
    const now = new Date();
    now.setDate(1);
    now.setMonth(now.getMonth() - 1);
    const timeOptionStart = new Date(now);
    const timeOptionEnd = new Date().setDate(0);
    const startDate = this.startDate(timeOptionStart);
    const endDate = this.endDate(timeOptionEnd);
    return { startDate, endDate };
  }

  get last30days() {
    const firstDay = this.currentTime.getDate() - 30;
    const timeOptionStart = new Date().setDate(firstDay);
    const startDate = this.formatTime(timeOptionStart);
    const endDate = this.formatTime(this.currentTime);
    return { startDate, endDate };
  }

  get firstQuarter() {
    const firstDayOfQuarter = new Date();
    firstDayOfQuarter.setMonth(0);
    firstDayOfQuarter.setDate(1);
    const timeOptionStart = new Date(firstDayOfQuarter);
    const lastDayOfQuarter = new Date();
    let endDate;
    if (this.currentQuarter > 1) {
      lastDayOfQuarter.setMonth(2);
      lastDayOfQuarter.setDate(31);
      const timeOptionEnd = new Date(lastDayOfQuarter);
      endDate = this.endDate(timeOptionEnd);
    } else {
      const timeOptionEnd = new Date(lastDayOfQuarter);
      endDate = this.formatTime(timeOptionEnd);
    }
    const startDate = this.startDate(timeOptionStart);
    return { startDate, endDate };
  }

  get secondQuarter() {
    if (this.currentQuarter < 2) {
      return;
    }
    const firstDayOfQuarter = new Date();
    firstDayOfQuarter.setMonth(3);
    firstDayOfQuarter.setDate(1);
    const timeOptionStart = new Date(firstDayOfQuarter);
    const lastDayOfQuarter = new Date();
    let endDate;
    if (this.currentQuarter > 2) {
      lastDayOfQuarter.setMonth(5);
      lastDayOfQuarter.setDate(30);
      const timeOptionEnd = new Date(lastDayOfQuarter);
      endDate = this.endDate(timeOptionEnd);
    } else if (this.currentQuarter === 2) {
      const timeOptionEnd = new Date(lastDayOfQuarter);
      endDate = this.formatTime(timeOptionEnd);
    }
    const startDate = this.startDate(timeOptionStart);
    return { startDate, endDate };
  }

  get thirdQuarter() {
    if (this.currentQuarter < 3) {
      return;
    }
    const firstDayOfQuarter = new Date();
    firstDayOfQuarter.setMonth(6);
    firstDayOfQuarter.setDate(1);
    const timeOptionStart = new Date(firstDayOfQuarter);
    const lastDayOfQuarter = new Date();
    let endDate;
    if (this.currentQuarter > 3) {
      lastDayOfQuarter.setMonth(8);
      lastDayOfQuarter.setDate(30);
      const timeOptionEnd = new Date(lastDayOfQuarter);
      endDate = this.endDate(timeOptionEnd);
    } else if (this.currentQuarter === 3) {
      const timeOptionEnd = new Date(lastDayOfQuarter);
      endDate = this.formatTime(timeOptionEnd);
    }
    const startDate = this.startDate(timeOptionStart);
    return { startDate, endDate };
  }

  get fourthQuarter() {
    if (this.currentQuarter < 4) {
      return;
    }
    const firstDayOfQuarter = new Date();
    firstDayOfQuarter.setMonth(9);
    firstDayOfQuarter.setDate(1);
    const timeOptionStart = new Date(firstDayOfQuarter);
    const lastDayOfQuarter = new Date();
    let endDate;
    const timeOptionEnd = new Date(lastDayOfQuarter);
    endDate = this.formatTime(timeOptionEnd);
    const startDate = this.startDate(timeOptionStart);
    return { startDate, endDate };
  }

  get currentYear() {
    const firstDayOfYear = new Date();
    firstDayOfYear.setMonth(0);
    firstDayOfYear.setDate(1);
    const timeOptionStart = new Date(firstDayOfYear);
    const startDate = this.startDate(timeOptionStart);
    const endDate = this.formatTime(this.currentTime);
    return { startDate, endDate };
  }

  get lastYear() {
    const firstDayOfLastYear = new Date();
    firstDayOfLastYear.setMonth(0);
    firstDayOfLastYear.setDate(1);
    firstDayOfLastYear.setFullYear(this.currentTime.getFullYear() - 1);
    const timeOptionStart = new Date(firstDayOfLastYear);
    const startDate = this.startDate(timeOptionStart);

    const lastDayOfLastYear = new Date();
    lastDayOfLastYear.setMonth(11);
    lastDayOfLastYear.setDate(31);
    lastDayOfLastYear.setFullYear(this.currentTime.getFullYear() - 1);
    const timeOptionEnd = new Date(lastDayOfLastYear);
    const endDate = this.endDate(timeOptionEnd);
    return { startDate, endDate };
  }

  chooseTimeFilter(startDate, endDate, title, element) {
    //Call api filter
    console.log({ startDate, endDate, title, element });
    if (this.chooseTimeFilterMethod == 1) {
      this.choosenStaticMethod = title;
    } else {
      this.choosenStateMethod = title;
    }
    element.style.display = 'none';
  }

  displayDetailOption(currentElement) {
    const filterFormList = document.querySelectorAll(
      '.filter-form-container-expand'
    );
    if (window.getComputedStyle(currentElement, null).display == 'none') {
      filterFormList.forEach((ele) => {
        ele.setAttribute('style', 'display:none');
      });
      currentElement.style.display = 'block';
      return;
    }
    filterFormList.forEach((ele) => {
      ele.setAttribute('style', 'display:none');
    });
  }

  get selectedStartDateDisplay() {
    if (!this.selectedStartDate) return;
    return moment(new Date(this.selectedStartDate)).format('DD/MM/YYYY');
  }

  get selectedStartDay() {
    if (!this.selectedStartDate) return;
    const startDay = moment(new Date(this.selectedStartDate))
      .locale('vi')
      .format('dddd');
    return startDay.charAt(0).toUpperCase() + startDay.slice(1);
  }

  get selectedEndDateDisplay() {
    if (!this.selectedEndDate) {
      this.selectedEndDate = this.currentTime;
    }
    return moment(new Date(this.selectedEndDate)).format('DD/MM/YYYY');
  }

  get selectedEndDay() {
    if (!this.selectedEndDate) {
      this.selectedEndDate = this.currentTime;
    }
    const endDay = moment(new Date(this.selectedEndDate))
      .locale('vi')
      .format('dddd');
    return endDay.charAt(0).toUpperCase() + endDay.slice(1);
  }

  onSelectStartDate(event) {
    this.selectedStartDate = event;

    if (
      this.selectedEndDate &&
      new Date(this.selectedEndDate).getTime() <
        new Date(this.selectedStartDate).getTime()
    ) {
      this.selectedEndDate = null;
    }
  }

  onSelectEndDate(event, currentEle) {
    this.selectedEndDate = event;
    const selectedTimeShowOnRadioButton = `${this.selectedStartDateDisplay} - ${this.selectedEndDateDisplay}`;
    this.chooseTimeFilter(
      this.selectedStartDate,
      this.selectedEndDate,
      selectedTimeShowOnRadioButton,
      currentEle
    );
  }

  resetSelectedDate() {
    this.selectedStartDate = null;
    this.selectedEndDate = null;
    this.choosenStateMethod = this.multiLanguageService.instant(
      'filter.choose_range_time'
    );
  }
}
