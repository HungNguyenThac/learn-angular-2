import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import {
  MAT_MOMENT_DATE_FORMATS,
  MomentDateAdapter,
} from '@angular/material-moment-adapter';
import {
  DateAdapter,
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE,
} from '@angular/material/core';

@Component({
  selector: 'app-base-filter-form',
  templateUrl: './base-filter-form.component.html',
  styleUrls: ['./base-filter-form.component.scss'],
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
export class BaseFilterFormComponent implements OnInit {
  currentTime = new Date();
  currentQuarter = Math.floor((this.currentTime.getMonth() + 3) / 3);
  timeFilterOptions: any = [
    {
      mainTitle: 'Theo ngày',
      options: [
        {
          title: 'Hôm nay',
          startDate: this.today.startDate,
          endDate: this.today.endDate,
        },
        {
          title: 'Hôm qua',
          startDate: this.yesterday.startDate,
          endDate: this.yesterday.endDate,
        },
      ],
    },
    {
      mainTitle: 'Theo tuần',
      options: [
        {
          title: 'Tuần này',
          startDate: this.currentWeek.startDate,
          endDate: this.currentWeek.endDate,
        },
        {
          title: 'Tuần trước',
          startDate: this.lastWeek.startDate,
          endDate: this.lastWeek.endDate,
        },
        {
          title: '7 ngày qua',
          startDate: this.last7days.startDate,
          endDate: this.last7days.endDate,
        },
      ],
    },
    {
      mainTitle: 'Theo tháng',
      options: [
        {
          title: 'Tháng này',
          startDate: this.currentMonth.startDate,
          endDate: this.currentMonth.endDate,
        },
        {
          title: 'Tháng trước',
          startDate: this.lastMonth.startDate,
          endDate: this.lastMonth.endDate,
        },
        {
          title: '30 ngày qua',
          startDate: this.last30days.startDate,
          endDate: this.last30days.endDate,
        },
      ],
    },
    {
      mainTitle: 'Theo quý',
      options: [
        {
          title: 'Quý I',
          startDate: this.firstQuarter.startDate,
          endDate: this.firstQuarter.endDate,
        },
        {
          title: 'Quý II',
          startDate: this.secondQuarter.startDate,
          endDate: this.secondQuarter.endDate,
        },
        {
          title: 'Quý III',
          startDate: this.thirdQuarter.startDate,
          endDate: this.thirdQuarter.endDate,
        },
        {
          title: 'Quý IV',
          startDate: this.fourthQuarter.startDate,
          endDate: this.fourthQuarter.endDate,
        },
      ],
    },
    {
      mainTitle: 'Theo năm',
      options: [
        {
          title: 'Năm nay',
          startDate: this.currentYear.startDate,
          endDate: this.currentYear.endDate,
        },
        {
          title: 'Năm trước',
          startDate: this.lastYear.startDate,
          endDate: this.lastYear.endDate,
        },
        {
          title: 'Toàn thời gian',
          startDate: null,
          endDate: this.today.endDate,
        },
      ],
    },
  ];
  chooseTimeFilterMethod: number;
  choosenStaticMethod: string = 'Toàn thời gian';
  choosenStateMethod: string = 'Chọn khoảng thời gian';
  selectedStartDate: Date | null;
  selectedEndDate: Date | null = this.currentTime;
  constructor() {}

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

  showHideDetailOption(currentElement, otherElement) {
    otherElement.style.display = 'none';
    if (window.getComputedStyle(currentElement, null).display == 'none') {
      return (currentElement.style.display = 'block');
    }
    return (currentElement.style.display = 'none');
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
    this.choosenStateMethod = 'Chọn khoảng thời gian';
  }
}
