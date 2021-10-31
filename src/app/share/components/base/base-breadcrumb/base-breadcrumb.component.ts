import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-base-breadcrumb',
  templateUrl: './base-breadcrumb.component.html',
  styleUrls: ['./base-breadcrumb.component.scss'],
})
export class BaseBreadcrumbComponent implements OnInit {
  @Input() title: string;
  @Input() iconClass: string;
  @Input() iconImgSrc: string;
  @Input() searchPlaceholder: string;
  @Input() searchFields: string[] = [];
  @Input() searchable: boolean = true;
  @Input() extraActionLabel: string;
  @Input() btnAddText: string;
  @Input() showBtnAdd: boolean = false;

  @Output() submitSearchForm = new EventEmitter<string>();
  @Output() clickBtnAdd = new EventEmitter<string>();

  searchForm: FormGroup;

  constructor(private formBuilder: FormBuilder) {
    this.searchForm = this.formBuilder.group({
      keyword: [''],
    });
  }

  ngOnInit(): void {}

  private resetSearchForm() {
    this.searchForm.reset();
  }

  private submitSearch() {
    const searchData = this.searchForm.getRawValue();
    this.submitSearchForm.emit(searchData);
  }
}
