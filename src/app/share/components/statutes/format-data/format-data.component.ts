import { Component, Input, OnInit } from '@angular/core';
import {
  DATA_CELL_TYPE,
  DATA_STATUS_TYPE,
} from '../../../../core/common/enum/operator';

@Component({
  selector: 'app-format-data',
  templateUrl: './format-data.component.html',
  styleUrls: ['./format-data.component.scss'],
})
export class FormatDataComponent implements OnInit {
  @Input() type: DATA_CELL_TYPE;
  @Input() value: string;
  _format: any;
  @Input() get format() {
    return this._format;
  }

  set format(value) {
    this._format = value;
    this.getLink(this._format)
  }

  link: string;

  constructor() {}

  ngOnInit(): void {}

  getLink(format) {
    switch (format?.field) {
      case "customerId":
        this.link = `/customer/list?id__e=${this.format?.value}`;
        break;

      default:
        break;
    }
  }
}
