import { ApiResponseCustomerInfo } from './../../../../../../../open-api-modules/dashboard-api-docs/model/apiResponseCustomerInfo';
import { ApiResponsePaydayLoanHmg } from './../../../../../../../open-api-modules/dashboard-api-docs/model/apiResponsePaydayLoanHmg';
import { Subscription } from 'rxjs';
import { Component, Input, OnInit } from '@angular/core';
import { PaydayLoan } from 'open-api-modules/loanapp-api-docs';
import { ApplicationHmgControllerService, CustomerInfo } from 'open-api-modules/dashboard-api-docs';
import { CustomerDetailService } from 'src/app/pages/customer/components/customer-detail-element/customer-detail.service';

@Component({
  selector: 'app-loan-detail',
  templateUrl: './loan-detail.component.html',
  styleUrls: ['./loan-detail.component.scss'],
})
export class LoanDetailComponent implements OnInit {
  _loanId: string;
  @Input()
  get loanId(): string {
    return this._loanId;
  }

  set loanId(value: string) {
    this._loanId = value;
  }


  _customerId: string;
  @Input()
  get customerId(): string {
    return this._customerId;
  }

  set customerId(value: string) {
    this._customerId = value;
  }

  loanDetail: PaydayLoan;
  userInfo: CustomerInfo;

  subManager = new Subscription();
  constructor(
    private applicationHmgControllerService: ApplicationHmgControllerService,
    private customerDetailService: CustomerDetailService
  ) {}

  ngOnInit(): void {
    this._getLoanById(this.loanId);
    this._getCustomerInfoById(this.customerId);
  }

  private _getLoanById(loanId) {
    if (!loanId) return;
    this.subManager.add(
      this.applicationHmgControllerService
        .getLoanById1(this.loanId)
        .subscribe((data: ApiResponsePaydayLoanHmg) => {
          this.loanDetail = data?.result;
        })
    );
  }

  private _getCustomerInfoById(customerId) {
    if (!customerId) return;
    this.subManager.add(
      this.customerDetailService
        .getById(customerId)
        .subscribe((data: ApiResponseCustomerInfo) => {
          this.userInfo = data?.result;
        })
    );
  }
}
