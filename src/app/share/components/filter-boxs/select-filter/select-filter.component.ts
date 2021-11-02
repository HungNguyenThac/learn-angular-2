import { EventEmitter, Input, Output } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { FilterOptionModel } from '../../../../public/models/filter-option.model';
import { FilterEventModel } from '../../../../public/models/filter-event.model';
import { FilterItemModel } from '../../../../public/models/filter-item.model';

@Component({
  selector: 'app-select-filter',
  templateUrl: './select-filter.component.html',
  styleUrls: ['./select-filter.component.scss'],
})
export class SelectFilterComponent implements OnInit {
  @Input() filterOption: FilterOptionModel;

  @Output() completeFilter = new EventEmitter<FilterEventModel>();

  selectedItem: string[] = [];

  constructor() {}

  ngOnInit(): void {}

  selectSubItem(item) {
    const index = this.selectedItem.findIndex((ele) => ele === item);
    if (index < 0) {
      this.selectedItem.push(item);
    } else {
      this.selectedItem.splice(index, 1);
    }

    console.log('this.selectedItem', this.selectedItem);
  }

  selectSingleItem(item: FilterItemModel) {
    this.completeFilter.emit({
      type: this.filterOption.type,
      controlName: this.filterOption.controlName,
      value: item.value,
    });
  }

  resetSelectedItem() {
    this.selectedItem = [];
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
}
