import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { BUTTON_TYPE } from '../../../../../core/common/enum/operator';

@Component({
  selector: 'app-monex-product-dialog',
  templateUrl: './monex-product-dialog.component.html',
  styleUrls: ['./monex-product-dialog.component.scss'],
})
export class MonexProductDialogComponent implements OnInit {
  // Fixed Data
  workflows = [
    {
      name: 'Luồng trạng thái 1',
    },
    {
      name: 'Luồng trạng thái 2',
    },
    {
      name: 'Luồng trạng thái 3',
    },
  ];
  pdModels = [
    {
      name: 'PD Model 1',
    },
    {
      name: 'PD Model 2',
    },
    {
      name: 'PD Model 3',
    },
  ];
  matrices = [
    {
      name: 'Limit Control Matrix 1',
    },
    {
      name: 'Limit Control Matrix 2',
    },
    {
      name: 'Limit Control Matrix 3',
    },
  ];
  contracts = [
    {
      name: 'Hợp đồng 1',
    },
    {
      name: 'Hợp đồng 2',
    },
    {
      name: 'Hợp đồng 3',
    },
  ];
  mifos = [
    {
      name: 'Mifos Product ID 1',
    },
    {
      name: 'Mifos Product ID 2',
    },
    {
      name: 'Mifos Product ID 3',
    },
  ];
  form: FormGroup;
  dialogTitle: string;
  input1Focus: boolean = false;
  input2Focus: boolean = false;
  input3Focus: boolean = false;
  info;

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: any,
    private dialogRef: MatDialogRef<MonexProductDialogComponent>,
    private formBuilder: FormBuilder
  ) {
    this.buildForm();
    if (data) {
      this.initDialogData(data);
    }
  }

  buildForm() {
    this.form = this.formBuilder.group({
      code: 'MXP-XXX',
      name: [''],
      description: [''],
      status: false,
      workflow: [''],
      pdModel: [''],
      matrix: [''],
      contract: [''],
      mifos: [''],
    });
  }

  initDialogData(data) {
    this.dialogTitle = data?.dialogTitle;
    this.info = data?.info;
    let status = data?.info?.status === 'ACTIVE';
    if (data.info) {
      this.form.patchValue({
        code: this.info?.code,
        name: this.info?.name,
        description: this.info?.description,
        status: status,
        workflow: this.info?.workflow,
        pdModel: this.info?.pdModel,
        matrix: this.info?.matrix,
        contract: this.info?.contract,
        mifos: this.info?.mifos,
      });
    }
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

  ngOnInit(): void {}
}
