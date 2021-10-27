import { FormBuilder, FormGroup } from '@angular/forms';
import { CustomerInfo } from './../../../../../../open-api-modules/dashboard-api-docs/model/customerInfo';
import { MultiLanguageService } from './../../../../share/translate/multiLanguageService';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Component, Inject, OnInit } from '@angular/core';
import * as moment from 'moment';
import {
  MAT_MOMENT_DATE_FORMATS,
  MomentDateAdapter,
} from '@angular/material-moment-adapter';
import {
  DateAdapter,
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE,
} from '@angular/material/core';

@Component({
  selector: 'app-customer-detail-update-dialog',
  templateUrl: './customer-detail-update-dialog.component.html',
  styleUrls: ['./customer-detail-update-dialog.component.scss'],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'vi-VN' },
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE],
    },
    { provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS },
  ],
})
export class CustomerDetailUpdateDialogComponent implements OnInit {
  customerInfo: CustomerInfo = {};
  customerId: string = '';
  customerInvidualForm: FormGroup;
  genderOptions: string[] = [
    this.multiLanguageService.instant('customer.individual_info.gender_male'),
    this.multiLanguageService.instant('customer.individual_info.gender_female'),
    this.multiLanguageService.instant('customer.individual_info.gender_other'),
  ];

  numberOfDependentsOptions: any = {
    fieldName: 'customer.individual_info.number_of_dependents',
    options: ['0', '1', '2', '3', 'Nhiều hơn 3'],
  };

  maritalStatusOptions = {
    fieldName: 'Tình trạng độc thân',
    options: ['Độc thân', 'Đã kết hôn', 'Ly hôn', 'Góa vợ/ chồng'],
  };

  bankNameOptions = {
    fieldName: 'Ngân hàng',
    options: [
      'Ngân hàng Việt Nam Thịnh Vượng (VPBank)',
      'Ngân hàng Công thương Việt Nam (VietinBank)',
      'Ngân hàng Đầu tư và Phát triển Việt Nam (BIDV)',
      'Ngân hàng Ngoại Thương Việt Nam (Vietcombank)',
    ],
  };

  leftIndividualInfos: any = [
    {
      title: this.multiLanguageService.instant('customer.individual_info.id'),
      value: this.customerId,
    },
    {
      title: this.multiLanguageService.instant(
        'customer.individual_info.fullname'
      ),
      value: this.customerInfo.firstName,
    },
    {
      title: this.multiLanguageService.instant(
        'customer.individual_info.phone_number'
      ),
      value: this.customerInfo.mobileNumber,
    },
    {
      title: this.multiLanguageService.instant(
        'customer.individual_info.date_of_birth'
      ),
      value: this.customerInfo.dateOfBirth,
    },
    {
      title: this.multiLanguageService.instant(
        'customer.individual_info.gender'
      ),
      value: this.customerInfo.gender,
    },
    {
      title: this.multiLanguageService.instant(
        'customer.individual_info.email'
      ),
      value: this.customerInfo.emailAddress,
    },
    {
      title: this.multiLanguageService.instant('customer.individual_info.cmnd'),
      value: this.customerInfo.identityNumberOne,
    },
    {
      title: this.multiLanguageService.instant(
        'customer.individual_info.permanent_address'
      ),
      value: this.customerInfo.addressTwoLine1,
    },
    {
      title: this.multiLanguageService.instant(
        'customer.individual_info.current_residence'
      ),
      value: this.customerInfo.addressOneLine1,
    },
    {
      title: this.multiLanguageService.instant(
        'customer.individual_info.id_origin'
      ),
      value: this.customerInfo.idOrigin,
    },
  ];

  rightIndividualInfos: any = [
    {
      title: this.multiLanguageService.instant(
        'customer.individual_info.number_of_dependents'
      ),
      value: this.customerInfo.borrowerDetailTextVariable1,
    },
    {
      title: this.multiLanguageService.instant(
        'customer.individual_info.marital_status'
      ),
      value: this.customerInfo.maritalStatus,
    },
    {
      title: this.multiLanguageService.instant(
        'customer.individual_info.bank_account_number'
      ),
      value: this.customerInfo.accountNumber,
    },
    {
      title: this.multiLanguageService.instant(
        'customer.individual_info.bank_name'
      ),
      value: this.customerInfo.bankName + ` ( ${this.customerInfo.bankCode} )`,
    },
    {
      title: this.multiLanguageService.instant(
        'customer.individual_info.va_account_number'
      ),
      value: this.customerId,
    },
    {
      title: this.multiLanguageService.instant(
        'customer.individual_info.created_at'
      ),
      value: this.customerInfo.createdAt,
    },
    {
      title: this.multiLanguageService.instant(
        'customer.individual_info.updated_at'
      ),
      value: this.customerInfo.updatedAt,
    },
    // {
    //   title: this.multiLanguageService.instant(
    //     'customer.individual_info.updated_by'
    //   ),
    //   value: this.customerInfo.updatedBy,
    // },
  ];
  constructor(
    private dialogRef: MatDialogRef<CustomerDetailUpdateDialogComponent>,
    @Inject(MAT_DIALOG_DATA) private data: any,
    private multiLanguageService: MultiLanguageService,
    private formBuilder: FormBuilder
  ) {
    if (data) {
      this.customerInfo = data;
    }
  }

  ngOnInit(): void {
    //Build form
    const customerInfoControlsConfig = {
      id: [''],
      fullname: [''],
      phoneNumber: [''],
      email: [''],
      dateOfBirth: [''],
      gender: [''],
      cmnd: [''],
      permanentAddress: [''],
      currentResidence: [''],
      idOrigin: [''],
      numberOfDependents: [''],
      maritalStatus: [''],
      bankAccountNumber: [''],
      bankName: [''],
      vaAccountNumber: [''],
      createdAt: [''],
      updatedAt: ['1'],
    };
    this.customerInvidualForm = this.formBuilder.group(
      customerInfoControlsConfig
    );
  }

  submit() {
    console.log("form info", this.customerInvidualForm.getRawValue())
    this.dialogRef.close()
  }

  formatTime(time) {
    if (!time) return;
    return moment(new Date(time), 'YYYY-MM-DD HH:mm:ss').format(
      'DD-MM-YYYY HH:mm'
    );
  }
}
