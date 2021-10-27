import { MatDialog } from '@angular/material/dialog';
import { Component, OnInit } from '@angular/core';
import { MultiLanguageService } from '../../../../share/translate/multiLanguageService';
import { CustomerInfo } from '../../../../../../open-api-modules/dashboard-api-docs';
import { CustomerDetailUpdateDialogComponent } from '../customer-individual-info-update-dialog/customer-detail-update-dialog.component';

@Component({
  selector: 'app-customer-individual-info',
  templateUrl: './customer-individual-info.component.html',
  styleUrls: ['./customer-individual-info.component.scss'],
})
export class CustomerIndividualInfoComponent implements OnInit {
  customerInfo: CustomerInfo = {};
  customerId: string = '';
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
    private multiLanguageService: MultiLanguageService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.customerInfo.firstName = 'Nguyễn Trần Thanh Trúc';
  }
  openUpdateDialog() {
    const dialogRef = this.dialog.open(CustomerDetailUpdateDialogComponent, {
      panelClass: 'custom-info-dialog-container',
      maxWidth: '1200px',
      width: '90%',
      data: this.customerInfo,
    });
  }
}
