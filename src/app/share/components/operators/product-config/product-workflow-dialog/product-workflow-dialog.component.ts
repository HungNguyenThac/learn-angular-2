import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { BUTTON_TYPE } from '../../../../../core/common/enum/operator';

@Component({
  selector: 'app-product-workflow-dialog',
  templateUrl: './product-workflow-dialog.component.html',
  styleUrls: ['./product-workflow-dialog.component.scss'],
})
export class ProductWorkflowDialogComponent implements OnInit {
  leftArr = [
    {
      id: '1',
      name: 'Chờ duyệt',
    },
    {
      id: '2',
      name: 'Đã duyệt',
    },
    {
      id: '3',
      name: 'Đã huỷ',
    },
    {
      id: '4',
      name: 'Từ chối',
    },
    {
      id: '5',
      name: 'Hoàn thành',
    },
    {
      id: '6',
      name: 'Đã giải ngân',
    },
    {
      id: '7',
      name: 'Trong hạn',
    },
  ];
  rightArr = [];
  leftTemp = [];
  rightTemp = [];

  form: FormGroup;
  dialogTitle: string;
  isAccountNameInputFocus: boolean = false;
  isCodeInputFocus: boolean = false;
  isLoginInputFocus: boolean = false;
  info;

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: any,
    private dialogRef: MatDialogRef<ProductWorkflowDialogComponent>,
    private formBuilder: FormBuilder
  ) {
    this.buildForm();
    if (data) {
      this.initDialogData(data);
    }
  }

  ngOnInit(): void {}

  buildForm() {
    this.form = this.formBuilder.group({
      code: 'PW-XXX',
      name: [''],
      description: [''],
      status: false,
    });
  }

  initDialogData(data) {
    this.dialogTitle = data?.dialogTitle;
    this.info = data?.info;
    let status = data?.info?.status === 'ACTIVE';

    this.form.patchValue({
      code: this.info?.code,
      name: this.info?.name,
      description: this.info?.description,
      status: status,
    });
  }

  submitForm() {
    if (this.form.controls.status.value) {
      this.form.patchValue({
        status: 'ACTIVE',
      });
    }
    if (this.form.invalid) {
      return;
    }
    this.dialogRef.close({
      type: BUTTON_TYPE.PRIMARY,
      data: this.form.getRawValue(),
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
