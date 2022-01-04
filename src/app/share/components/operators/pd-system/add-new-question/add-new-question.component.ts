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
      name: 'String',
    },
    {
      name: 'ListString',
    },
    {
      name: 'DateTime',
    },
    {
      name: 'Checkbox',
    },
    {
      name: 'RadioButton',
    },
    {
      name: 'Slider',
    },
  ];

  addPdForm: FormGroup;
  oneAnswer: boolean = false;
  manyAnswers: boolean = false;
  sliderType: boolean = false;
  numAnswers: any[] = [
    {
      value: '',
    },
  ];
  sliderAnswers: any[] = [
    {
      value: '',
      placeholder: 'MinNumber',
    },
    {
      value: '',
      placeholder: 'MaxNumber',
    },
    {
      value: '',
      placeholder: 'StepSize',
    },
    {
      value: '',
      placeholder: 'Đơn vị',
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
  questionInfo;

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
      content: [''],
      answerType: [''],
      placeholder: [''],
      description: [''],
      order: [''],
    });
  }

  initDialogData(data) {
    this.questionInfo = data?.questionInfo;
    this.dialogTitle = data?.dialogTitle;

    this.addPdForm.patchValue({
      code: this.questionInfo?.code,
      content: this.questionInfo?.content,
      answerType: this.questionInfo?.answerType,
      groupIds: this.questionInfo?.groupIds,
      description: this.questionInfo?.description,
      order: this.questionInfo?.order,
    });
  }

  selectType(type) {
    if (type === 'String' || type === 'DateTime') {
      this.oneAnswer = true;
      this.manyAnswers = false;
      this.sliderType = false;
    } else if (type === 'Slider') {
      this.oneAnswer = false;
      this.manyAnswers = false;
      this.sliderType = true;
    } else {
      this.oneAnswer = false;
      this.manyAnswers = true;
      this.sliderType = false;
    }
  }

  addAnswer() {
    this.numAnswers.push({
      value: '',
    });
  }

  removeAnswer(i: number) {
    this.numAnswers.splice(i, 1);
  }

  submitForm() {
    this.numAnswers = this.numAnswers.filter((answer) => answer.value !== '');
    console.log('sliderAnswers', this.sliderAnswers);
    if (this.addPdForm.invalid) {
      return;
    }
    this.dialogRef.close({
      type: BUTTON_TYPE.PRIMARY,
      data: this.addPdForm.getRawValue(),
    });
  }
}
