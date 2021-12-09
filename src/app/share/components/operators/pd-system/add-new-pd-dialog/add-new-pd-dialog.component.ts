import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {BUTTON_TYPE} from "../../../../../core/common/enum/operator";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";

@Component({
  selector: 'app-add-new-pd-dialog',
  templateUrl: './add-new-pd-dialog.component.html',
  styleUrls: ['./add-new-pd-dialog.component.scss'],
})
export class AddNewPdDialogComponent implements OnInit {
  addPdForm: FormGroup;
  isAccountNameInputFocus: boolean = false;
  isLoginInputFocus: boolean = false;
  isPasswordInputFocus: boolean = false;
  isRePasswordInputFocus: boolean = false;
  isRoleInputFocus: boolean = false;
  isPhoneInputFocus: boolean = false;
  isEmailInputFocus: boolean = false;
  isPositionInputFocus: boolean = false;
  isNoteInputFocus: boolean = false;
  dialogTitle: string;

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: any,
    private dialogRef: MatDialogRef<AddNewPdDialogComponent>,
    private formBuilder: FormBuilder
  ) {
    this.buildAccountInfoForm();
    if (data) {
      this.initDialogData(data);
    }
  }

  ngOnInit(): void {
  }

  buildAccountInfoForm() {
    this.addPdForm = this.formBuilder.group({
      accountName: [''],
      username: [''],
      accountPassword: [
        '',
        [Validators.minLength(8), Validators.maxLength(50)],
      ],
      accountRePassword: [''],
      accountRole: [''],
      accountPhone: [''],
      accountEmail: ['', [Validators.email]],
      accountPosition: [''],
      accountNote: [''],
    });
  }

  initDialogData(data) {
    this.dialogTitle = data?.dialogTitle;

    // this.addPdForm.patchValue({
    //   accountName: this.userInfo?.fullName,
    //   username: this.userInfo?.username,
    //   accountPassword: '',
    //   accountRePassword: '',
    //   accountRole: this.userInfo?.groupId,
    //   accountPhone: this.userInfo?.mobile,
    //   accountEmail: this.userInfo?.email,
    //   accountPosition: this.userInfo?.position,
    //   accountNote: this.userInfo?.note,
    // });
  }

  submitForm() {
    if (this.addPdForm.invalid) {
      return;
    }
    this.dialogRef.close({
      type: BUTTON_TYPE.PRIMARY,
      data: this.addPdForm.getRawValue(),
    });
  }
}
