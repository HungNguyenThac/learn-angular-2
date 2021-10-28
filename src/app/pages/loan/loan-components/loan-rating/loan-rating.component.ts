import { CustomerInfo } from './../../../../../../open-api-modules/dashboard-api-docs/model/customerInfo';
import { PaydayLoan } from './../../../../../../open-api-modules/loanapp-api-docs/model/paydayLoan';
import { Component, OnInit } from '@angular/core';
import { MultiLanguageService } from '../../../../share/translate/multiLanguageService';

@Component({
  selector: 'app-loan-rating',
  templateUrl: './loan-rating.component.html',
  styleUrls: ['./loan-rating.component.scss'],
})
export class LoanRatingComponent implements OnInit {
  customerInfo: CustomerInfo = {};
  loanDetail: PaydayLoan = {};
  loanId: string = '';
  customerId: string = '';
  middleColumn: any = [
    {
      title: this.multiLanguageService.instant(
        'loan_app.rating.customer_rating'
      ),
      value: this.multiLanguageService.instant(
        'loan_app.rating.very_satisfied'
      ),
    },
    {
      title: this.multiLanguageService.instant('loan_app.rating.comment'),
      value: ['Giải ngân nhanh chóng', 'Quy trình đơn giản', 'Mức phí hợp lý'],
    },
    {
      title: this.multiLanguageService.instant('loan_app.rating.other_comment'),
      value: 'Mình muốn có thông báo in app',
    },
  ];
  constructor(private multiLanguageService: MultiLanguageService) {}

  ngOnInit(): void {}
}
