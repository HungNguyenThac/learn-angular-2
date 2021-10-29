import { MultiLanguageService } from './../../../../../share/translate/multiLanguageService';
import { MatDialog } from '@angular/material/dialog';
import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { CustomerInfo } from 'open-api-modules/dashboard-api-docs';
import { PaydayLoan } from 'open-api-modules/loanapp-api-docs';

@Component({
  selector: 'app-loan-detail-info',
  templateUrl: './loan-detail-info.component.html',
  styleUrls: ['./loan-detail-info.component.scss'],
})
export class LoanDetailInfoComponent implements OnInit {
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
      title: this.multiLanguageService.instant(
        'loan_app.loan_info.salary_status'
      ),
      value: this.salaryStatus
        ? this.multiLanguageService.instant(
            'loan_app.loan_info.received_salary'
          )
        : this.multiLanguageService.instant(
            'loan_app.loan_info.not_received_salary'
          ),
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
        'loan_app.loan_info.max_loan_amount'
      ),
      value: this.maxLoanAmount,
    },
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
    {
      title: this.multiLanguageService.instant(
        'loan_app.loan_info.total_settlement_amount'
      ),
      value: this.totalSettlementAmount,
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

  currentTime = new Date();
  constructor(
    private multiLanguageService: MultiLanguageService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {}

  changeLoanStatus() {}

  get salaryStatus() {
    if (!this.loanDetail.getSalaryAt) return false;
    return (
      this.currentTime.getTime() >
      new Date(this.loanDetail.getSalaryAt).getTime()
    );
  }

  get loanCreatedAtDisplay() {
    return this.formatTime(this.loanDetail.createdAt);
  }

  //Số tiền vay tối đa
  get maxLoanAmount() {
    return this.customerInfo.annualIncome * 0.8;
  }

  //Tổng tiền tất toán
  get totalSettlementAmount() {
    return this.loanDetail.latePenaltyPayment + this.loanDetail.expectedAmount;
  }

  formatTime(time) {
    if (!time) return;
    return moment(new Date(time), 'YYYY-MM-DD HH:mm:ss').format(
      'DD/MM/YYYY HH:mm A'
    );
  }
}
