import { MultiLanguageService } from '../../../../translate/multiLanguageService';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { VirtualAccount } from '../../../../../../../open-api-modules/payment-api-docs';
import {
  Bank,
  CompanyInfo,
  CustomerInfo,
} from '../../../../../../../open-api-modules/dashboard-api-docs';
import { BUTTON_TYPE } from '../../../../../core/common/enum/operator';

@Component({
  selector: 'app-dialog-company-info-update',
  templateUrl: './dialog-company-info-update.component.html',
  styleUrls: ['./dialog-company-info-update.component.scss'],
})
export class DialogCompanyInfoUpdateComponent implements OnInit {
  customerInfo: CustomerInfo = {};
  bankOptions: Array<Bank>;
  companyOptions: Array<CompanyInfo>;
  customerId: string;

  companyInfoForm: FormGroup;
  constructor(
    private dialogRef: MatDialogRef<DialogCompanyInfoUpdateComponent>,
    @Inject(MAT_DIALOG_DATA) data: any,
    private multiLanguageService: MultiLanguageService,
    private formBuilder: FormBuilder
  ) {
    this.buildCompanyInfoForm();
    if (data) {
      this.initDialogData(data);
    }
  }

  ngOnInit(): void {}

  buildCompanyInfoForm() {
    this.companyInfoForm = this.formBuilder.group({
      companyId: [''],
      employeeCode: [''],
      tngFirstName: [''],
      tngLastName: [''],
      officeCode: [''],
      officeName: [''],
      annualIncome: [''],
      workingDay: [''],
      accountNumber: [''],
      bankCode: [''],
      bankName: [''],
    });
  }

  initDialogData(data: any) {
    this.customerInfo = data?.customerInfo;
    this.customerId = data?.customerId;
    this.bankOptions = data?.bankOptions ? data?.bankOptions : [];
    this.companyOptions = data?.companyOptions ? data?.companyOptions : [];

    this.companyInfoForm.patchValue({
      companyId: this.customerInfo.companyId,
      employeeCode: this.customerInfo.organizationName,
      tngFirstName: this.customerInfo.tngData.ten,
      tngLastName: this.customerInfo.tngData.hoDem,
      firstName: this.customerInfo.firstName,
      officeCode: this.customerInfo.officeCode,
      officeName: this.customerInfo.officeName,
      annualIncome: this.customerInfo.annualIncome,
      workingDay: this.customerInfo.workingDay,
      accountNumber: this.customerInfo.accountNumber,
      bankCode: this.customerInfo.bankCode,
      bankName: this.customerInfo.bankName,
    });
  }

  changeBank(event) {
    if (!event.value) {
      return;
    }
    let seletedBank = this.bankOptions.filter(
      (bank) => bank.bankName === event.value
    );
    if (!seletedBank) return;
    this.companyInfoForm.controls.bankCode.setValue(seletedBank[0].bankCode);
  }

  submitForm() {
    this.dialogRef.close({
      type: BUTTON_TYPE.PRIMARY,
      data: this.companyInfoForm.getRawValue(),
    });
  }
}
