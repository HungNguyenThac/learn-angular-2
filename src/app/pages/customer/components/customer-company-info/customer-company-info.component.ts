import { MatDialog } from '@angular/material/dialog';
import { Component, OnInit } from '@angular/core';
import { CustomerInfo } from '../../../../../../open-api-modules/dashboard-api-docs';
import { CompanyInfo } from '../../../../../../open-api-modules/dashboard-api-docs';
import { MultiLanguageService } from '../../../../share/translate/multiLanguageService';
import { DialogCompanyInfoUpdateComponent } from '../dialog-company-info-update/dialog-company-info-update.component';

@Component({
  selector: 'app-customer-company-info',
  templateUrl: './customer-company-info.component.html',
  styleUrls: ['./customer-company-info.component.scss'],
})
export class CustomerCompanyInfoComponent implements OnInit {
  customerInfo: CustomerInfo = {};
  companyInfo: CompanyInfo = {};

  leftCompanyInfos: any = [
    {
      title: this.multiLanguageService.instant(
        'customer.company_info.company_name'
      ),
      value: this.companyInfo.name,
    },
    {
      title: this.multiLanguageService.instant(
        'customer.company_info.employee_code'
      ),
      value: this.customerInfo.organizationName,
    },
    {
      title: this.multiLanguageService.instant(
        'customer.company_info.last_name'
      ),
      value: this.customerInfo.tngData?.hoDem,
    },
    {
      title: this.multiLanguageService.instant(
        'customer.company_info.first_name'
      ),
      value: this.customerInfo.tngData?.ten,
    },
    {
      title: this.multiLanguageService.instant(
        'customer.company_info.office_code'
      ),
      value: this.customerInfo.officeCode,
    },
    {
      title: this.multiLanguageService.instant(
        'customer.company_info.office_name'
      ),
      value: this.customerInfo.officeName,
    },
  ];

  rightCompanyInfos: any = [
    {
      title: this.multiLanguageService.instant(
        'customer.company_info.annual_income'
      ),
      value: this.customerInfo.annualIncome,
    },
    {
      title: this.multiLanguageService.instant(
        'customer.company_info.working_days'
      ),
      value: this.customerInfo.workingDay,
    },
    {
      title: this.multiLanguageService.instant(
        'customer.company_info.account_number'
      ),
      value: this.customerInfo.accountNumber,
    },
    {
      title: this.multiLanguageService.instant(
        'customer.company_info.bank_name'
      ),
      value: this.customerInfo.bankName,
    },
    {
      title: this.multiLanguageService.instant(
        'customer.company_info.bank_code'
      ),
      value: this.customerInfo.bankCode,
    },
    {
      title: this.multiLanguageService.instant(
        'customer.company_info.received_date'
      ),
      value: this.customerInfo.tngData?.createdAt,
    },
  ];

  constructor(
    private multiLanguageService: MultiLanguageService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {}

  openUpdateDialog() {
    const dialogRef = this.dialog.open(DialogCompanyInfoUpdateComponent, {
      panelClass: 'custom-info-dialog-container',
      maxWidth: '800px',
      width: '90%',
      data: this.customerInfo,
    });
  }
}
