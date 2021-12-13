import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { BUTTON_TYPE } from '../../../../../core/common/enum/operator';

@Component({
  selector: 'app-add-new-question',
  templateUrl: './add-new-question.component.html',
  styleUrls: ['./add-new-question.component.scss'],
})
export class AddNewQuestionComponent implements OnInit {
  answerTypes = [
    {
      id: '1',
      name: 'String',
    },
    {
      id: '2',
      name: 'ListString',
    },
    {
      id: '3',
      name: 'DateTime',
    },
    {
      id: '4',
      name: 'Checkbox',
    },
    {
      id: '5',
      name: 'RadioButton',
    },
  ];

  addPdForm: FormGroup;
  oneAnswer: boolean = false;
  manyAnswers: boolean = false;
  numAnswers: any[] = [
    {
      id: '',
      value: '',
    },
  ];

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
    private dialogRef: MatDialogRef<AddNewQuestionComponent>,
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
      name: [''],
      type: [''],
      note: [''],
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

  selectType(type) {
    if (type === '1' || type === '3') {
      this.oneAnswer = true;
      this.manyAnswers = false;
    } else {
      this.oneAnswer = false;
      this.manyAnswers = true;
    }
  }

  addAnswer() {
    this.numAnswers.push({
      id: this.numAnswers.length + 1,
      value: '',
    });
  }

  removeAnswer(i: number) {
    this.numAnswers.splice(i, 1);
  }

  submitForm() {
    this.numAnswers = this.numAnswers.filter((answer) => answer.value !== '');
    console.log(this.numAnswers);
    if (this.addPdForm.invalid) {
      return;
    }
    this.dialogRef.close({
      type: BUTTON_TYPE.PRIMARY,
      data: this.addPdForm.getRawValue(),
    });
  }
}
