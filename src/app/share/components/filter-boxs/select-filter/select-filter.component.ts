import { EventEmitter, Input, Output } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { FilterOptionModel } from '../../../../public/models/filter/filter-option.model';
import { FilterEventModel } from '../../../../public/models/filter/filter-event.model';
import { FilterItemModel } from '../../../../public/models/filter/filter-item.model';
import { FILTER_DATETIME_TYPE } from '../../../../core/common/enum/operator';

@Component({
  selector: 'app-select-filter',
  templateUrl: './select-filter.component.html',
  styleUrls: ['./select-filter.component.scss'],
})
export class SelectFilterComponent implements OnInit {
  _filterOption: FilterOptionModel;
  @Input()
  get filterOption(): FilterOptionModel {
    return this._filterOption;
  }

  set filterOption(filterOptionModel: FilterOptionModel) {
    console.log("filterOption", filterOptionModel.value)
    this.selectedItems = filterOptionModel.value || [];
    this._filterOption = filterOptionModel;
  }

  @Output() completeFilter = new EventEmitter<FilterEventModel>();

  selectedItems: string[] = [];

  constructor() {}

  ngOnInit(): void {}

  public selectSubItem(item) {
    const index = this.selectedItems.findIndex((ele) => ele === item);
    if (index < 0) {
      this.selectedItems.push(item);
    } else {
      this.selectedItems.splice(index, 1);
    }

    this.completeFilter.emit({
      type: this.filterOption.type,
      controlName: this.filterOption.controlName,
      value: this.selectedItems,
    });
  }

  get displayTitle() {
    return this._filterOption.options[0].subOptions
      .filter((subOption) => {
        return this.selectedItems.includes(subOption.value);
      })
      .map((subOption) => {
        return subOption.code;
      })
      .join(',');
  }

  public selectSingleItem(item: FilterItemModel) {
    this.completeFilter.emit({
      type: this.filterOption.type,
      controlName: this.filterOption.controlName,
      value: item.value,
    });
  }

  public resetSelectedItem() {
    this.selectedItems = [];
    this.completeFilter.emit({
      type: this.filterOption.type,
      controlName: this.filterOption.controlName,
      value: this.selectedItems,
    });
  }

  public displayDetailOption(currentElement) {
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
}
