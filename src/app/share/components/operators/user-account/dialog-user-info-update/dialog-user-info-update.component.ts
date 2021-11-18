import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup } from '@angular/forms';
import { BUTTON_TYPE } from '../../../../../core/common/enum/operator';

@Component({
  selector: 'app-dialog-user-info-update',
  templateUrl: './dialog-user-info-update.component.html',
  styleUrls: ['./dialog-user-info-update.component.scss'],
})
export class DialogUserInfoUpdateComponent implements OnInit {
  accountInfoForm: FormGroup;
  isAccountNameInputFocus: boolean = false;
  isPhoneInputFocus: boolean = false;
  isNoteInputFocus: boolean = false;

  roleOptions = {
    fieldName: 'Vai trò',
    options: ['Super Admin', '2', '3'],
  };

  constructor(
    private dialogRef: MatDialogRef<DialogUserInfoUpdateComponent>,
    private formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) data: any
  ) {
    this.buildAccountInfoForm();
    if (data) {
      this.initDialogData(data);
    }
  }

  ngOnInit(): void {}

  buildAccountInfoForm() {
    this.accountInfoForm = this.formBuilder.group({
      accountName: [''],
      accountLogin: [''],
      accountRole: [''],
      accountPhone: [''],
      accountEmail: [''],
      accountNote: [''],
    });
  }

  initDialogData(data: any) {
    this.accountInfoForm.patchValue({
      accountName: data.accountName,
      accountLogin: data.accountLogin,
      accountRole: data.accountRole,
      accountPhone: data.accountPhone,
      accountEmail: data.accountEmail,
      accountNote: data.accountNote,
    });
  }

  submitForm() {
    this.dialogRef.close({
      type: BUTTON_TYPE.PRIMARY,
      data: this.accountInfoForm.getRawValue(),
    });
  }
}
