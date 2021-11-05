import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-dialog-user-info-update',
  templateUrl: './dialog-user-info-update.component.html',
  styleUrls: ['./dialog-user-info-update.component.scss'],
})
export class DialogUserInfoUpdateComponent implements OnInit {
  accountInfoForm: FormGroup;

  constructor(
    private dialogRef: MatDialogRef<DialogUserInfoUpdateComponent>,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {}

  buildCompanyInfoForm() {
    this.accountInfoForm = this.formBuilder.group({
      companyId: [''],
      employeeCode: [''],
    });
  }
}
