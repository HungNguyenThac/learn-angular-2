import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CustomerInfo } from '../../../../../../open-api-modules/dashboard-api-docs';
import { MultiLanguageService } from '../../../../share/translate/multiLanguageService';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, Inject, OnInit } from '@angular/core';
import * as moment from 'moment';
import { VirtualAccount } from '../../../../../../open-api-modules/payment-api-docs';
import { Bank } from 'open-api-modules/dashboard-api-docs';
import { BUTTON_TYPE } from '../../../../core/common/enum/operator';

@Component({
  selector: 'app-customer-detail-update-dialog',
  templateUrl: './customer-detail-update-dialog.component.html',
  styleUrls: ['./customer-detail-update-dialog.component.scss'],
})
export class CustomerDetailUpdateDialogComponent implements OnInit {
  customerInfo: CustomerInfo = {};
  virtualAccount: VirtualAccount = {};
  bankOptions: Array<Bank>;
  customerId: string = '';
  selfieSrc: string;

  customerIndividualForm: FormGroup;

  maxDateTime = moment(new Date(), 'YYYY-MM-DD')
    .subtract(18, 'years')
    .toISOString();

  minDateTime = moment(new Date(), 'YYYY-MM-DD')
    .subtract(70, 'years')
    .toISOString();

  genderOptions: string[] = [
    this.multiLanguageService.instant('customer.individual_info.gender_male'),
    this.multiLanguageService.instant('customer.individual_info.gender_female'),
    this.multiLanguageService.instant('customer.individual_info.gender_other'),
  ];

  numberOfDependentsOptions: any = {
    fieldName: 'Số người PTTC',
    options: ['0', '1', '2', '3', 'Nhiều hơn 3'],
  };

  maritalStatusOptions = {
    fieldName: 'Tình trạng độc thân',
    options: ['Độc thân', 'Đã kết hôn', 'Ly hôn', 'Góa vợ/ chồng'],
  };

  constructor(
    private dialogRef: MatDialogRef<CustomerDetailUpdateDialogComponent>,
    @Inject(MAT_DIALOG_DATA) private data: any,
    private multiLanguageService: MultiLanguageService,
    private formBuilder: FormBuilder
  ) {
    this.buildIndividualForm();

    if (data) {
      this.initDialogData(data);
    }
  }

  ngOnInit(): void {}

  buildIndividualForm() {
    this.customerIndividualForm = this.formBuilder.group({
      id: [''],
      firstName: ['', [Validators.maxLength(250)]],
      mobileNumber: ['', [Validators.minLength(10), Validators.maxLength(12)]],
      email: ['', [Validators.email]],
      dateOfBirth: ['', [Validators.required]],
      gender: ['', [Validators.required]],
      identityNumberOne: [
        '',
        [Validators.minLength(9), Validators.maxLength(12)],
      ],
      permanentAddress: ['', [Validators.maxLength(250)]],
      currentResidence: ['', [Validators.maxLength(250)]],
      idOrigin: ['', Validators.maxLength(250)],
      numberOfDependents: ['', [Validators.required]],
      maritalStatus: ['', [Validators.required]],
      accountNumber: [''],
      bankCode: [''],
      bankName: [''],
      vaAccountNumber: [''],
      note: [''],
      createdAt: [''],
      updatedAt: [''],
    });
  }

  initDialogData(data: any) {
    this.customerInfo = data?.customerInfo;
    this.customerId = data?.customerId;
    this.virtualAccount = data?.virtualAccount;
    this.selfieSrc = data?.selfieSrc;
    this.bankOptions = data?.bankOptions ? data?.bankOptions : [];

    this.customerIndividualForm.patchValue({
      id: this.customerId,
      firstName: this.customerInfo?.firstName,
      mobileNumber: this.customerInfo?.mobileNumber,
      email: this.customerInfo?.emailAddress,
      dateOfBirth: this.formatDateToDisplay(this.customerInfo?.dateOfBirth),
      gender: this.customerInfo?.gender,
      identityNumberOne: this.customerInfo?.identityNumberOne,
      permanentAddress: this.customerInfo?.addressTwoLine1,
      currentResidence: this.customerInfo?.addressOneLine1,
      idOrigin: this.customerInfo?.idOrigin,
      numberOfDependents: this.customerInfo?.borrowerDetailTextVariable1,
      maritalStatus: this.customerInfo?.maritalStatus,
      accountNumber: this.customerInfo?.accountNumber || null,
      note: this.customerInfo?.note || null,
      bankCode: this.customerInfo?.bankCode || null,
      bankName: this.customerInfo?.bankName || null,
      vaAccountNumber: this.virtualAccount?.accountNumber || null,
      createdAt: this.customerInfo?.createdAt
        ? this.formatTime(this.customerInfo?.createdAt)
        : null,
      updatedAt: this.customerInfo?.updatedAt
        ? this.formatTime(this.customerInfo?.updatedAt)
        : null,
    });
  }

  submitForm() {
    if (this.customerIndividualForm.invalid) {
      return;
    }
    this.dialogRef.close({
      type: BUTTON_TYPE.PRIMARY,
      data: this.customerIndividualForm.getRawValue(),
    });
  }

  formatTime(time) {
    if (!time) return;
    return moment(new Date(time), 'YYYY-MM-DD HH:mm:ss').format(
      'DD/MM/YYYY HH:mm'
    );
  }

  formatDateToDisplay(date) {
    let formatDate = moment(date, ['DD-MM-YYYY', 'DD/MM/YYYY']).format(
      'YYYY-DD-MM HH:mm:ss'
    );
    return moment(formatDate, 'YYYY-DD-MM').toISOString();
  }

  changeBank(event) {
    if (!event.value) {
      return;
    }
    let seletedBank = this.bankOptions.filter(
      (bank) => bank.bankCode === event.value
    );
    this.customerIndividualForm.controls.bankName.setValue(
      seletedBank[0].bankName
    );
  }
}
