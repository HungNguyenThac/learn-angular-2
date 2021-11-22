import { Component, OnInit, ViewChildren } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup } from '@angular/forms';
import { BUTTON_TYPE } from '../../../../../core/common/enum/operator';

@Component({
  selector: 'app-add-new-user-dialog',
  templateUrl: './add-new-user-dialog.component.html',
  styleUrls: ['./add-new-user-dialog.component.scss'],
})
export class AddNewUserDialogComponent implements OnInit {
  addAccountForm: FormGroup;
  isAccountNameInputFocus: boolean = false;
  isLoginInputFocus: boolean = false;
  isPasswordInputFocus: boolean = false;
  isRePasswordInputFocus: boolean = false;
  isRoleInputFocus: boolean = false;
  isPhoneInputFocus: boolean = false;
  isEmailInputFocus: boolean = false;
  isPositionInputFocus: boolean = false;
  isNoteInputFocus: boolean = false;

  roleOptions = {
    fieldName: 'Vai trò',
    options: ['Super Admin', '2', '3'],
  };
  positionOptions = {
    fieldName: 'Vị trí công việc',
    options: ['Kiểm duyệt viên', 'DB Merchant', 'Operator Admin', 'Kế toán'],
  };

  constructor(
    private dialogRef: MatDialogRef<AddNewUserDialogComponent>,
    private formBuilder: FormBuilder
  ) {
    this.buildAccountInfoForm();
  }

  buildAccountInfoForm() {
    this.addAccountForm = this.formBuilder.group({
      accountName: [''],
      accountLogin: [''],
      accountPassword: [''],
      accountRePassword: [''],
      accountRole: [''],
      accountPhone: [''],
      accountEmail: [''],
      accountPosition: [''],
      accountNote: [''],
    });
  }

  submitForm() {
    this.dialogRef.close({
      type: BUTTON_TYPE.PRIMARY,
      data: this.addAccountForm.getRawValue(),
    });
  }

  ngOnInit(): void {}
}
