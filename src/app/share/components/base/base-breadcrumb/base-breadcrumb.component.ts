import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { AddNewUserDialogComponent } from '../../operators/user-account/add-new-user-dialog/add-new-user-dialog.component';

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
  @Input() searchable: boolean = true;
  @Input() extraActionLabel: string;
  @Input() btnAddText: string;
  @Input() showBtnAdd: boolean = false;
  @Input() maxLengthSearchInput: number = 50;
  @Input() btnExportText: string;
  @Input() showBtnExport: boolean = false;

  _keyword: string;
  @Input()
  get keyword(): string {
    return this._keyword;
  }

  set keyword(value: string) {
    this.searchForm.controls.keyword.setValue(value);
    this._keyword = value;
  }

  @Output() submitSearchForm = new EventEmitter<string>();
  @Output() clickBtnAdd = new EventEmitter<string>();
  @Output() clickBtnExport = new EventEmitter<string>();

  searchForm: FormGroup;

  constructor(private formBuilder: FormBuilder, private dialog: MatDialog) {
    this.searchForm = this.formBuilder.group({
      keyword: [''],
    });
  }

  ngOnInit(): void {}

  public resetSearchForm() {
    this.searchForm.reset();
  }

  public submitSearch() {
    const searchData = this.searchForm.getRawValue();
    this.submitSearchForm.emit(searchData);
  }

  onClickButtonAdd(event) {
    this.clickBtnAdd.emit(event);
  }

  onClickButtonExport(event) {
    this.clickBtnExport.emit(event);
  }
}
