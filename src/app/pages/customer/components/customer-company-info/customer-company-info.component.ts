import { MatDialog } from '@angular/material/dialog';
import { Component, Input, OnInit } from '@angular/core';
import { CustomerInfo } from '../../../../../../open-api-modules/dashboard-api-docs';
import { CompanyInfo } from '../../../../../../open-api-modules/dashboard-api-docs';
import { MultiLanguageService } from '../../../../share/translate/multiLanguageService';
import { DialogCompanyInfoUpdateComponent } from '../dialog-company-info-update/dialog-company-info-update.component';
import {DATA_CELL_TYPE} from "../../../../core/common/enum/operator";

@Component({
  selector: 'app-customer-company-info',
  templateUrl: './customer-company-info.component.html',
  styleUrls: ['./customer-company-info.component.scss'],
})
export class CustomerCompanyInfoComponent implements OnInit {
  @Input() customerInfo: CustomerInfo = {};
  @Input() customerId: string = '';
  companyInfo: CompanyInfo = {};

  get leftCompanyInfos() {
    return [
      {
        title: this.multiLanguageService.instant(
          'customer.company_info.company_name'
        ),
        value: this.companyInfo.name,
        type: DATA_CELL_TYPE.TEXT,
        format: null
      },
      {
        title: this.multiLanguageService.instant(
          'customer.company_info.employee_code'
        ),
        value: this.customerInfo.organizationName,
        type: DATA_CELL_TYPE.TEXT,
        format: null
      },
      {
        title: this.multiLanguageService.instant(
          'customer.company_info.last_name'
        ),
        value: this.customerInfo.tngData?.hoDem,
        type: DATA_CELL_TYPE.TEXT,
        format: null
      },
      {
        title: this.multiLanguageService.instant(
          'customer.company_info.first_name'
        ),
        value: this.customerInfo.tngData?.ten,
        type: DATA_CELL_TYPE.TEXT,
        format: null
      },
      {
        title: this.multiLanguageService.instant(
          'customer.company_info.office_code'
        ),
        value: this.customerInfo.officeCode,
        type: DATA_CELL_TYPE.TEXT,
        format: null
      },
      {
        title: this.multiLanguageService.instant(
          'customer.company_info.office_name'
        ),
        value: this.customerInfo.officeName,
        type: DATA_CELL_TYPE.TEXT,
        format: null
      },
    ];
  }

  get rightCompanyInfos() {
    return [
      {
        title: this.multiLanguageService.instant(
          'customer.company_info.annual_income'
        ),
        value: this.customerInfo.annualIncome,
        type: DATA_CELL_TYPE.CURRENCY,
        format: null
      },
      {
        title: this.multiLanguageService.instant(
          'customer.company_info.working_days'
        ),
        value: this.customerInfo.workingDay,
        type: DATA_CELL_TYPE.TEXT,
        format: null
      },
      {
        title: this.multiLanguageService.instant(
          'customer.company_info.account_number'
        ),
        value: this.customerInfo.accountNumber,
        type: DATA_CELL_TYPE.TEXT,
        format: null
      },
      {
        title: this.multiLanguageService.instant(
          'customer.company_info.bank_name'
        ),
        value: this.customerInfo.bankName,
        type: DATA_CELL_TYPE.TEXT,
        format: null
      },
      {
        title: this.multiLanguageService.instant(
          'customer.company_info.bank_code'
        ),
        value: this.customerInfo.bankCode,
        type: DATA_CELL_TYPE.TEXT,
        format: null
      },
      {
        title: this.multiLanguageService.instant(
          'customer.company_info.received_date'
        ),
        value: this.customerInfo.tngData?.createdAt,
        type: DATA_CELL_TYPE.DATETIME,
        format: 'dd/MM/yyyy HH:mm',
      },
    ];
  }

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
