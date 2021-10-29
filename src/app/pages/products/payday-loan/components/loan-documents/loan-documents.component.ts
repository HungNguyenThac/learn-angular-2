import { MultiLanguageService } from 'src/app/share/translate/multiLanguageService';
import { PaydayLoan } from './../../../../../../../open-api-modules/loanapp-hmg-api-docs/model/paydayLoan';
import { CustomerInfo } from './../../../../../../../open-api-modules/dashboard-api-docs/model/customerInfo';
import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-loan-documents',
  templateUrl: './loan-documents.component.html',
  styleUrls: ['./loan-documents.component.scss'],
})
export class LoanDocumentsComponent implements OnInit {
  customerInfo: CustomerInfo = {};
  loanDetail: PaydayLoan = {};
  loanId: string = '';
  customerId: string = '';
  leftColumn: any = [
    {
      title: this.multiLanguageService.instant('loan_app.loan_info.loan_code'),
      value: this.loanDetail.loanCode,
    },
    {
      title: this.multiLanguageService.instant(
        'loan_app.loan_info.customer_name'
      ),
      value: this.customerInfo.firstName,
    },
    {
      title: this.multiLanguageService.instant(
        'loan_app.loan_info.phone_number'
      ),
      value: this.customerInfo.mobileNumber,
    },
    {
      title: this.multiLanguageService.instant('loan_app.loan_info.created_at'),
      value: this.loanDetail.createdAt,
    },
    {
      title: this.multiLanguageService.instant('loan_app.loan_info.updated_at'),
      value: this.loanDetail.createdAt,
    },
  ];

  middleColumn: any = [
    {
      title: this.multiLanguageService.instant(
        'loan_app.loan_info.loan_amount'
      ),
      value: this.loanDetail.expectedAmount,
    },
    {
      title: this.multiLanguageService.instant(
        'loan_app.loan_info.service_charge'
      ),
      value: this.loanDetail.totalServiceFees,
    },
    {
      title: this.multiLanguageService.instant(
        'loan_app.loan_info.actual_received_amount'
      ),
      value: this.loanDetail.actualAmount,
    },
    {
      title: this.multiLanguageService.instant('loan_app.loan_info.loan_term'),
      value: this.loanDetail.expectedTenure,
    },
    {
      title: this.multiLanguageService.instant(
        'loan_app.loan_info.late_payment_fee'
      ),
      value: this.loanDetail.latePenaltyPayment,
    },
  ];

  rightColumn: any = [
    {
      title: this.multiLanguageService.instant(
        'loan_app.loan_info.voucher_code'
      ),
      value: this.loanDetail.voucherTransactionId,
    },
    {
      title: this.multiLanguageService.instant(
        'loan_app.loan_info.loan_status'
      ),
      value: this.loanDetail.status,
    },
    {
      title: this.multiLanguageService.instant(
        'loan_app.loan_info.payment_status'
      ),
      value: this.loanDetail.repaymentStatus,
    },
    {
      title: this.multiLanguageService.instant(
        'loan_app.loan_info.staff_in_charge'
      ),
      value: 'Minh Nguyễn',
    },
  ];
  constructor(
    private multiLanguageService: MultiLanguageService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {}
}
