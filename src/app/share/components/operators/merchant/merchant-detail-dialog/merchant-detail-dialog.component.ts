import { Component, Inject, Input, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MultiLanguageService } from '../../../../translate/multiLanguageService';
import { BUTTON_TYPE } from '../../../../../core/common/enum/operator';

@Component({
  selector: 'app-merchant-detail-dialog',
  templateUrl: './merchant-detail-dialog.component.html',
  styleUrls: ['./merchant-detail-dialog.component.scss'],
})
export class MerchantDetailDialogComponent implements OnInit {
  tabIndex: number = 0;
  merchantInfoForm: FormGroup;
  merchantInfo;
  dialogTitle: string = this.multiLanguageService.instant(
    'merchant.merchant_dialog.add_merchant_title'
  );
  merchantGroupOptions: any[] = [
    {
      id: 1,
      name: 'Nhóm nhà cung cấp 1',
    },
    {
      id: 2,
      name: 'Nhóm nhà cung cấp 2',
    },
    {
      id: 3,
      name: 'Nhóm nhà cung cấp 3',
    },
  ];
  bankOptions: any[] = [
    {
      id: 1,
      name: 'Ngân hàng Việt Nam Thịnh Vượng',
    },
    {
      id: 2,
      name: 'Ngân hàng Pro vip',
    },
    {
      id: 3,
      name: 'Ngân hàng Vip',
    },
  ];

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: any,
    private dialogRef: MatDialogRef<MerchantDetailDialogComponent>,
    private multiLanguageService: MultiLanguageService,
    private formBuilder: FormBuilder
  ) {
    this.buildIndividualForm();
    if (data) {
      this.initDialogData(data);
    }
  }

  ngOnInit(): void {}

  submitForm() {
    if (this.merchantInfoForm.invalid) {
      return;
    }
    this.dialogRef.close({
      type: BUTTON_TYPE.PRIMARY,
      data: this.merchantInfoForm.getRawValue(),
    });
  }

  initDialogData(data: any) {
    this.merchantInfo = data?.merchantInfo;
    this.tabIndex = data?.tabIndex;
    this.dialogTitle = data?.dialogTitle;

    this.merchantInfoForm.patchValue({
      merchantId: this.merchantInfo?.merchantId,
      merchantName: this.merchantInfo?.merchantName,
      merchantStatus: this.merchantInfo?.merchantStatus,
      merchantPhone: this.merchantInfo?.merchantPhone,
      merchantEmail: this.merchantInfo?.merchantEmail,
      merchantDate: this.merchantInfo?.merchantDate,
      merchantGroup: this.merchantInfo?.merchantGroup,
      merchantCompany: this.merchantInfo?.merchantCompany,
      merchantTaxNumber: this.merchantInfo?.merchantTaxNumber,
      merchantRegistrationNumber: this.merchantInfo?.merchantRegistrationNumber,
      merchantWebsite: this.merchantInfo?.merchantWebsite,
      merchantAddress: this.merchantInfo?.merchantAddress,
      creator: this.merchantInfo?.creator,
      createDate: this.merchantInfo?.createDate,
      merchantNote: this.merchantInfo?.merchantNote,
      contactor: this.merchantInfo?.contactor,
      role: this.merchantInfo?.role,
      phone: this.merchantInfo?.phone,
      mailTo: this.merchantInfo?.mailTo,
      mailCc: this.merchantInfo?.mailCc,
      bank: this.merchantInfo?.bankId,
      branch: this.merchantInfo?.branch,
      accountNum: this.merchantInfo?.accountNum,
      accountName: this.merchantInfo?.accountName,
      note: this.merchantInfo?.note,
    });
  }

  buildIndividualForm() {
    this.merchantInfoForm = this.formBuilder.group({
      merchantId: '',
      merchantName: '',
      merchantStatus: '',
      merchantPhone: '',
      merchantEmail: '',
      merchantDate: '',
      merchantGroup: [''],
      merchantCompany: '',
      merchantTaxNumber: '',
      merchantRegistrationNumber: '',
      merchantWebsite: '',
      merchantAddress: '',
      creator: '',
      createDate: '',
      merchantNote: '',
      contactor: '',
      role: '',
      phone: '',
      mailTo: '',
      mailCc: '',
      bank: '',
      branch: '',
      accountNum: '',
      accountName: '',
      note: '',
    });
  }
}
