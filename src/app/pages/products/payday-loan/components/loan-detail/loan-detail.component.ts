import { NotificationService } from 'src/app/core/services/notification.service';
import { PaydayLoanHmg } from './../../../../../../../open-api-modules/dashboard-api-docs/model/paydayLoanHmg';
import { ApiResponsePaydayLoanTng } from './../../../../../../../open-api-modules/dashboard-api-docs/model/apiResponsePaydayLoanTng';
import { ApplicationTngControllerService } from './../../../../../../../open-api-modules/dashboard-api-docs/api/applicationTngController.service';
import { ApiResponseSearchAndPaginationResponseCompanyInfo } from './../../../../../../../open-api-modules/dashboard-api-docs/model/apiResponseSearchAndPaginationResponseCompanyInfo';
import { ApiResponseSearchAndPaginationResponseBank } from './../../../../../../../open-api-modules/dashboard-api-docs/model/apiResponseSearchAndPaginationResponseBank';
import { BankControllerService } from './../../../../../../../open-api-modules/dashboard-api-docs/api/bankController.service';
import { CompanyInfo } from './../../../../../../../open-api-modules/customer-api-docs/model/companyInfo';
import { Bank } from './../../../../../../../open-api-modules/dashboard-api-docs/model/bank';
import { MultiLanguageService } from './../../../../../share/translate/multiLanguageService';
import { ToastrService } from 'ngx-toastr';
import { RESPONSE_CODE } from './../../../../../core/common/enum/operator';
import { ApiResponseCustomerInfo } from './../../../../../../../open-api-modules/dashboard-api-docs/model/apiResponseCustomerInfo';
import { ApiResponsePaydayLoanHmg } from './../../../../../../../open-api-modules/dashboard-api-docs/model/apiResponsePaydayLoanHmg';
import { Subscription } from 'rxjs';
import { Component, EventEmitter, Input, OnInit, Output, OnDestroy } from '@angular/core';
import { PaydayLoan } from 'open-api-modules/loanapp-api-docs';
import {
  ApplicationHmgControllerService,
  CompanyControllerService,
  CustomerInfo,
} from 'open-api-modules/dashboard-api-docs';
import { CustomerDetailService } from 'src/app/pages/customer/components/customer-detail-element/customer-detail.service';

@Component({
  selector: 'app-loan-detail',
  templateUrl: './loan-detail.component.html',
  styleUrls: ['./loan-detail.component.scss'],
})
export class LoanDetailComponent implements OnInit, OnDestroy {
  loanDetail: PaydayLoanHmg;
  userInfo: CustomerInfo;
  bankOptions: Array<Bank>;
  companyOptions: Array<CompanyInfo>;
  @Input() groupName: string;
  @Output() loanDetailTriggerUpdateStatus = new EventEmitter<any>();
  @Output() detectUpdateLoanAfterSign = new EventEmitter();
  subManager = new Subscription();

  constructor(
    private applicationHmgControllerService: ApplicationHmgControllerService,
    private applicationTngControllerService: ApplicationTngControllerService,
    private customerDetailService: CustomerDetailService,
    private notifier: ToastrService,
    private multiLanguageService: MultiLanguageService,
    private bankControllerService: BankControllerService,
    private companyControllerService: CompanyControllerService,
    private notificationService: NotificationService
  ) {}

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

  timeOut;

  ngOnInit(): void {
    this._getLoanById(this.loanId);
    this._getCustomerInfoById(this.customerId);
    this._getBankOptions();
    this._getCompanyList();
  }

  loanDetailDetectChangeStatusTrigger() {
    this.triggerUpdateLoanElement()
  }

  triggerUpdateLoanAfterSign() {
    this.triggerUpdateLoanElement()
  }

  triggerUpdateLoanElement() {
    this.notificationService.showLoading({ showContent: true });
    this.timeOut = setTimeout(() => {
      this._getLoanById(this.loanId);
      this.notificationService.hideLoading();
    }, 3000);
  }

  private _getLoanById(loanId) {
    if (!loanId) return;
    if (this.groupName === 'HMG') {
      this.subManager.add(
        this.applicationHmgControllerService
          .getLoanById1(this.loanId)
          .subscribe((data: ApiResponsePaydayLoanHmg) => {
            this.loanDetail = data?.result;
            this.loanDetailTriggerUpdateStatus.emit(this.loanDetail);
            this.detectUpdateLoanAfterSign.emit(this.loanDetail);
            console.log(this.loanDetail, 'loanDetail----------------------');
          })
      );
    }
    if (this.groupName === 'TNG') {
      this.subManager.add(
        this.applicationTngControllerService
          .getLoanById(this.loanId)
          .subscribe((data: ApiResponsePaydayLoanTng) => {
            this.loanDetail = data?.result;
            this.loanDetailTriggerUpdateStatus.emit(this.loanDetail);
            console.log(this.loanDetail, 'loanDetail----------------------');
          })
      );
    }
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

  private _getBankOptions() {
    this.subManager.add(
      this.bankControllerService
        .getBank(200, 0, {})
        .subscribe((response: ApiResponseSearchAndPaginationResponseBank) => {
          if (response.responseCode !== RESPONSE_CODE.SUCCESS) {
            this.notifier.error(
              JSON.stringify(response?.message),
              response?.errorCode
            );
            return;
          }
          this.bankOptions = response?.result?.data;
        })
    );
  }

  private _getCompanyList() {
    this.subManager.add(
      this.companyControllerService
        .getCompanies(100, 0, {})
        .subscribe(
          (data: ApiResponseSearchAndPaginationResponseCompanyInfo) => {
            this.companyOptions = data?.result?.data;
          }
        )
    );
  }

  ngOnDestroy() {
    this.subManager.unsubscribe();
    clearTimeout(this.timeOut);
  }
}
