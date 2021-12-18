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
  dialogTitle = this.multiLanguageService.instant(
    'merchant.merchant_dialog.add_merchant_title'
  );
  typeOptions: any[] = [
    {
      id: 1,
      name: 'Tại cửa hàng',
    },
    {
      id: 2,
      name: 'Trực tuyến',
    },
  ];
  showOptions: any[] = [
    {
      id: 1,
      name: 'Hiển thị',
    },
    {
      id: 2,
      name: 'Hot Brand',
    },
    {
      id: 2,
      name: 'Promotion',
    },
  ];
  products: any[] = [
    {
      id: 1,
      name: 'Thực phẩm',
    },
    {
      id: 2,
      name: 'Thời trang',
    },
    {
      id: 3,
      name: 'Điện tử',
    },
  ];
  managers: any[] = [
    {
      id: 1,
      name: 'user1',
    },
    {
      id: 2,
      name: 'user2',
    },
    {
      id: 3,
      name: 'user3',
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
      merchantId: [''],
      merchantName: [''],
      merchantAddress: [''],
      merchantArea: [''],
      merchantCommune: [''],
      merchantManager: [''],
      merchantType: [''],
      merchantPhone: [''],
      merchantEmail: [''],
      merchantWebsite: [''],
      merchantRegistrationNumber: [''],
      merchantEstablish: [''],
      merchantProduct: [''],
      merchantFee: [''],
      merchantStatus: [''],
      merchantDate: [''],
      username: [''],
      password: [''],
      rePassword: [''],
      name: [''],
      position: [''],
      phone: [''],
      email: [''],
      discount: [''],
      show: [''],
      introduction: [''],
    });
  }
}
