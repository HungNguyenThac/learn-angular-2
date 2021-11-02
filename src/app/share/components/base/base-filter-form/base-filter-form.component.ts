import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FilterOptionModel } from '../../../../public/models/filter-option.model';
import { FilterEventModel } from '../../../../public/models/filter-event.model';
import { FilterActionEventModel } from '../../../../public/models/filter-action-event.model';

@Component({
  selector: 'app-base-filter-form',
  templateUrl: './base-filter-form.component.html',
  styleUrls: ['./base-filter-form.component.scss'],
})
export class BaseFilterFormComponent implements OnInit {
  @Input() filterOptions: FilterOptionModel[];

  @Output() triggerFilterChange = new EventEmitter<FilterEventModel>();
  @Output() triggerFilterAction = new EventEmitter<FilterActionEventModel>();

  constructor() {}

  ngOnInit(): void {}

  completeFilter(event: FilterEventModel) {
    this.triggerFilterChange.emit(event);
  }

  clickActionBtn(event: FilterActionEventModel) {
    this.triggerFilterAction.emit(event);
  }
}
