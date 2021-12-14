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
  @Input() externalValue: string;
  @Input() format: string | DATA_STATUS_TYPE;

  link: string;

  constructor() {}

  ngOnInit(): void {}
}
