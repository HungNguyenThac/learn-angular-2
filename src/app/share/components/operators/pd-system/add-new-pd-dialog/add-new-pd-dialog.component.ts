import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BUTTON_TYPE } from '../../../../../core/common/enum/operator';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-add-new-pd-dialog',
  templateUrl: './add-new-pd-dialog.component.html',
  styleUrls: ['./add-new-pd-dialog.component.scss'],
})
export class AddNewPdDialogComponent implements OnInit {
  //Mock data
  leftArr = [
    {
      name: 'Item 1',
      id: '1',
    },
    {
      name: 'Item 2',
      id: '2',
    },
    {
      name: 'Item 3',
      id: '3',
    },
    {
      name: 'Item 4',
      id: '4',
    },
    {
      name: 'Item 5',
      id: '5',
    },
    {
      name: 'Item 6',
      id: '6',
    },
  ];
  rightArr = [];
  leftTemp = [];
  rightTemp = [];

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
  inputCode: string;
  listTitle: string;
  inputName: string;

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

  ngOnInit(): void {}

  buildAccountInfoForm() {
    this.addPdForm = this.formBuilder.group({
      code: [''],
      content: [''],
      description: [''],
    });
  }

  initDialogData(data) {
    this.dialogTitle = data?.dialogTitle;
    this.inputName = data?.inputName;
    this.inputCode = data?.inputCode;
    this.listTitle = data?.listTitle;

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

  onClickQuestion(event, question) {
    event.target.classList.toggle('gray');
    if (this.leftTemp.includes(question)) {
      const index = this.leftTemp.indexOf(question);
      this.leftTemp.splice(index, 1);
      console.log(this.leftTemp);
    } else {
      this.leftTemp.push(question);
    }
  }

  onClickChosenQuestion(event, question) {
    event.target.classList.toggle('gray');
    if (this.rightTemp.includes(question)) {
      const index = this.rightTemp.indexOf(question);
      this.rightTemp.splice(index, 1);
    } else {
      this.rightTemp.push(question);
    }
  }

  moveToChosen() {
    this.rightArr = this.rightArr.concat(this.leftTemp);
    const tempSet = new Set(this.leftTemp);
    this.leftArr = this.leftArr.filter((question) => {
      return !tempSet.has(question);
    });
    this.leftTemp = [];
  }

  moveBack() {
    this.leftArr = this.leftArr.concat(this.rightTemp);
    const tempSet = new Set(this.rightTemp);
    this.rightArr = this.rightArr.filter((question) => {
      return !tempSet.has(question);
    });
    this.rightTemp = [];
  }
}
