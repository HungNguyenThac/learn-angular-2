import { NotificationService } from 'src/app/core/services/notification.service';
import { ToastrService } from 'ngx-toastr';
import { UpdateLoanStatusRequest } from './../../../../../../../open-api-modules/loanapp-hmg-api-docs/model/updateLoanStatusRequest';
import { Subscription } from 'rxjs';
import { PlPromptComponent } from './../../../../../share/components/dialogs/pl-prompt/pl-prompt.component';
import { PaydayLoanControllerService as PaydayLoanHmgControllerService } from './../../../../../../../open-api-modules/loanapp-hmg-api-docs/api/paydayLoanController.service';
import { PaydayLoanControllerService as PaydayLoanTngControllerService } from './../../../../../../../open-api-modules/loanapp-api-docs/api/paydayLoanController.service';
import { PAYDAY_LOAN_STATUS } from './../../../../../core/common/enum/payday-loan';
import {
  BUTTON_TYPE,
  DATA_CELL_TYPE,
  DATA_STATUS_TYPE,
} from './../../../../../core/common/enum/operator';
import { MultiLanguageService } from './../../../../../share/translate/multiLanguageService';
import { MatDialog } from '@angular/material/dialog';
import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  OnDestroy,
} from '@angular/core';
import * as moment from 'moment';
import {
  CustomerInfo,
  PaydayLoanHmg,
} from 'open-api-modules/dashboard-api-docs';
import { PaydayLoan } from 'open-api-modules/loanapp-api-docs';

@Component({
  selector: 'app-loan-detail-info',
  templateUrl: './loan-detail-info.component.html',
  styleUrls: ['./loan-detail-info.component.scss'],
})
export class LoanDetailInfoComponent implements OnInit, OnDestroy {
  _loanId: string;
  @Input()
  get loanId(): string {
    return this._loanId;
  }

  set loanId(value: string) {
    this._loanId = value;
  }

  customerId: string = '';

  _customerInfo: CustomerInfo;
  @Input()
  get customerInfo(): CustomerInfo {
    return this._customerInfo;
  }

  set customerInfo(value: CustomerInfo) {
    this._customerInfo = value;
  }

  _loanDetail: PaydayLoanHmg;
  @Input()
  get loanDetail(): PaydayLoanHmg {
    return this._loanDetail;
  }

  set loanDetail(value: PaydayLoanHmg) {
    this._loanDetail = value;
    this.getChangeLoanStatus();
    this.leftColumn = this._initLeftColumn();
    this.middleColumn = this._initMiddleColumn();
    this.rightColumn = this._initRightColumn();
  }

  private _initLeftColumn() {
    return [
      {
        title: this.multiLanguageService.instant(
          'loan_app.loan_info.loan_code'
        ),
        value: this.loanDetail?.loanCode,
        type: DATA_CELL_TYPE.TEXT,
        format: null,
      },
      {
        title: this.multiLanguageService.instant(
          'loan_app.loan_info.customer_name'
        ),
        value: this.customerInfo?.firstName,
        type: DATA_CELL_TYPE.TEXT,
        format: null,
      },
      {
        title: this.multiLanguageService.instant(
          'loan_app.loan_info.phone_number'
        ),
        value: this.customerInfo?.mobileNumber,
        type: DATA_CELL_TYPE.TEXT,
        format: null,
      },
      {
        title: this.multiLanguageService.instant(
          'loan_app.loan_info.salary_status'
        ),
        value: this.getSalaryStatus(this.loanDetail?.expectedTenure),
        type: DATA_CELL_TYPE.STATUS,
        format: DATA_STATUS_TYPE.PL_OTHER_STATUS,
      },
      {
        title: this.multiLanguageService.instant(
          'loan_app.loan_info.created_at'
        ),
        value: this.loanDetail?.createdAt,
        type: DATA_CELL_TYPE.DATETIME,
        format: 'dd/MM/yyyy HH:mm',
      },
      {
        title: this.multiLanguageService.instant(
          'loan_app.loan_info.updated_at'
        ),
        value: this.loanDetail?.createdAt,
        type: DATA_CELL_TYPE.DATETIME,
        format: 'dd/MM/yyyy HH:mm',
      },
    ];
  }

  private _initMiddleColumn() {
    return [
      {
        title: this.multiLanguageService.instant(
          'loan_app.loan_info.max_loan_amount'
        ),
        value: this.maxLoanAmount,
        type: DATA_CELL_TYPE.CURRENCY,
        format: null,
      },
      {
        title: this.multiLanguageService.instant(
          'loan_app.loan_info.loan_amount'
        ),
        value: this.loanDetail?.expectedAmount,
        type: DATA_CELL_TYPE.CURRENCY,
        format: null,
      },
      {
        title: this.multiLanguageService.instant(
          'loan_app.loan_info.service_charge'
        ),
        value: this.loanDetail?.totalServiceFees,
        type: DATA_CELL_TYPE.CURRENCY,
        format: null,
      },
      {
        title: this.multiLanguageService.instant(
          'loan_app.loan_info.actual_received_amount'
        ),
        value: this.loanDetail?.actualAmount,
        type: DATA_CELL_TYPE.CURRENCY,
        format: null,
      },
      {
        title: this.multiLanguageService.instant(
          'loan_app.loan_info.loan_term'
        ),
        value: this.loanDetail?.expectedTenure,
        type: DATA_CELL_TYPE.TEXT,
        format: null,
      },
      {
        title: this.multiLanguageService.instant(
          'loan_app.loan_info.late_payment_fee'
        ),
        value: this.loanDetail?.latePenaltyPayment,
        type: DATA_CELL_TYPE.CURRENCY,
        format: null,
      },
      {
        title: this.multiLanguageService.instant(
          'loan_app.loan_info.total_settlement_amount'
        ),
        value: this.totalSettlementAmount,
        type: DATA_CELL_TYPE.CURRENCY,
        format: null,
      },
    ];
  }

  private _initRightColumn() {
    return [
      {
        title: this.multiLanguageService.instant(
          'loan_app.loan_info.voucher_code'
        ),
        value: this.loanDetail?.voucherTransactionId,
        type: DATA_CELL_TYPE.TEXT,
        format: null,
      },
      {
        title: this.multiLanguageService.instant(
          'loan_app.loan_info.loan_status'
        ),
        value: this.loanDetail?.status,
        type: DATA_CELL_TYPE.STATUS,
        format: DATA_STATUS_TYPE.PL_HMG_STATUS,
      },
      {
        title: this.multiLanguageService.instant(
          'loan_app.loan_info.payment_status'
        ),
        value: this.loanDetail?.repaymentStatus,
        type: DATA_CELL_TYPE.STATUS,
        format: DATA_STATUS_TYPE.PL_REPAYMENT_STATUS,
      },
      {
        title: this.multiLanguageService.instant(
          'loan_app.loan_info.staff_in_charge'
        ),
        value: 'Minh Nguyễn',
        type: DATA_CELL_TYPE.TEXT,
        format: null,
      },
    ];
  }

  leftColumn: any[] = [];
  middleColumn: any[] = [];
  rightColumn: any[] = [];

  currentTime = new Date();

  @Input() groupName: string;
  nextLoanStatus: string = PAYDAY_LOAN_STATUS.UNKNOWN_STATUS;
  nextLoanStatusDisplay: string;
  rejectLoanStatus: string = PAYDAY_LOAN_STATUS.UNKNOWN_STATUS;
  rejectLoanStatusDisplay: string;
  salaryStatus: string;

  subManager = new Subscription();
  @Output() loanDetailDetectChangeStatus = new EventEmitter<any>();
  constructor(
    private multiLanguageService: MultiLanguageService,
    private dialog: MatDialog,
    private paydayLoanHmgControllerService: PaydayLoanHmgControllerService,
    private paydayLoanTngControllerService: PaydayLoanTngControllerService,
    private notificationService: NotificationService,
    private notifier: ToastrService
  ) {}

  ngOnInit(): void {}

  changeLoanStatus(newStatus, newStatusDisplay) {
    const currentLoanStatusDisplay = this.multiLanguageService.instant(
      `payday_loan.status.${this.loanDetail.status.toLowerCase()}`
    );

    let promptDialogRef = this.notificationService.openPrompt({
      title: this.multiLanguageService.instant('common.are_you_sure'),
      imgUrl: 'assets/img/payday-loan/warning-prompt-icon.png',
      content: this.multiLanguageService.instant(
        'loan_app.loan_info.confirm_change_status_description',
        {
          loan_code: this.loanDetail.loanCode,
          current_loan_status: currentLoanStatusDisplay,
          new_loan_status: newStatusDisplay,
        }
      ),
      primaryBtnText: this.multiLanguageService.instant('common.confirm'),
      secondaryBtnText: this.multiLanguageService.instant('common.skip'),
    });
    let reload: any;
    this.subManager.add(
      promptDialogRef.afterClosed().subscribe((buttonType: BUTTON_TYPE) => {
        if (buttonType === BUTTON_TYPE.PRIMARY) {
          const updateLoanStatusRequest: UpdateLoanStatusRequest = {
            customerId: this.loanDetail.customerId,
            status: newStatus,
          };
          if (this.groupName === 'HMG') {
            this.paydayLoanHmgControllerService
              .changeLoanStatus(this.loanDetail.id, updateLoanStatusRequest)
              .subscribe((result) => {
                if (result?.responseCode === 200) {
                  this.notifier.success('Cập nhật dữ liệu thành công');
                  reload = setTimeout(() => {
                    this.loanDetailDetectChangeStatus.emit('fetching');
                  }, 1000);
                } else {
                  this.notifier.error(JSON.stringify(result?.message));
                }
              });
          }

          if (this.groupName === 'TNG') {
            this.paydayLoanTngControllerService
              .changeLoanStatus(this.loanDetail.id, updateLoanStatusRequest)
              .subscribe((result) => {
                if (result?.responseCode === 200) {
                  this.notifier.success('Cập nhật dữ liệu thành công');
                  this.loanDetailDetectChangeStatus.emit('fetching');
                } else {
                  this.notifier.error(JSON.stringify(result?.message));
                }
              });
          }
        }
      })
    );
  }

  //Trạng thái trả lương
  getSalaryStatus(expectedTenure) {
    if (!expectedTenure) return;
    if (expectedTenure === 0) {
      this.salaryStatus = this.multiLanguageService.instant(
        'loan_app.loan_info.received_salary'
      );
      return this.salaryStatus;
    }
    this.salaryStatus = this.multiLanguageService.instant(
      'loan_app.loan_info.not_received_salary'
    );
    return this.salaryStatus;
  }

  //Số tiền vay tối đa
  get maxLoanAmount() {
    return this.customerInfo?.annualIncome * 0.8;
  }

  //Tổng tiền tất toán
  get totalSettlementAmount() {
    return (
      this.loanDetail?.latePenaltyPayment + this.loanDetail?.expectedAmount
    );
  }

  //Trạng thái khoản vay được phép thay đổi
  getChangeLoanStatus() {
    if (!this.loanDetail?.status) return;
    const currentLoanStatus = this.loanDetail?.status;
    switch (currentLoanStatus) {
      case PAYDAY_LOAN_STATUS.INITIALIZED:
        this.nextLoanStatus = PAYDAY_LOAN_STATUS.DOCUMENT_AWAITING;
        this.rejectLoanStatus = PAYDAY_LOAN_STATUS.WITHDRAW;
        break;

      case PAYDAY_LOAN_STATUS.DOCUMENT_AWAITING:
        this.nextLoanStatus = PAYDAY_LOAN_STATUS.DOCUMENTATION_COMPLETE;
        this.rejectLoanStatus = PAYDAY_LOAN_STATUS.WITHDRAW;
        break;

      case PAYDAY_LOAN_STATUS.DOCUMENTATION_COMPLETE:
        this.nextLoanStatus = PAYDAY_LOAN_STATUS.AUCTION;
        this.rejectLoanStatus = PAYDAY_LOAN_STATUS.REJECTED;
        break;

      case PAYDAY_LOAN_STATUS.AUCTION:
        this.nextLoanStatus = PAYDAY_LOAN_STATUS.FUNDED;
        this.rejectLoanStatus = PAYDAY_LOAN_STATUS.WITHDRAW;
        break;

      case PAYDAY_LOAN_STATUS.FUNDED:
        if (this.groupName === 'TNG') {
          this.nextLoanStatus = PAYDAY_LOAN_STATUS.CONTRACT_ACCEPTED;
          this.rejectLoanStatus = PAYDAY_LOAN_STATUS.WITHDRAW;
          break;
        }
        this.nextLoanStatus = PAYDAY_LOAN_STATUS.CONTRACT_AWAITING;
        this.rejectLoanStatus = PAYDAY_LOAN_STATUS.WITHDRAW;
        break;

      case PAYDAY_LOAN_STATUS.CONTRACT_AWAITING:
        this.nextLoanStatus = PAYDAY_LOAN_STATUS.CONTRACT_ACCEPTED;
        this.rejectLoanStatus = PAYDAY_LOAN_STATUS.WITHDRAW;
        break;

      case PAYDAY_LOAN_STATUS.CONTRACT_ACCEPTED:
        this.nextLoanStatus = PAYDAY_LOAN_STATUS.AWAITING_DISBURSEMENT;
        this.rejectLoanStatus = PAYDAY_LOAN_STATUS.WITHDRAW;
        break;

      case PAYDAY_LOAN_STATUS.AWAITING_DISBURSEMENT:
        this.nextLoanStatus = PAYDAY_LOAN_STATUS.DISBURSED;
        this.rejectLoanStatus = PAYDAY_LOAN_STATUS.WITHDRAW;
        break;

      case PAYDAY_LOAN_STATUS.DISBURSED:
        this.nextLoanStatus = PAYDAY_LOAN_STATUS.IN_REPAYMENT;
        this.rejectLoanStatus = PAYDAY_LOAN_STATUS.WITHDRAW;
        break;

      case PAYDAY_LOAN_STATUS.IN_REPAYMENT:
        this.nextLoanStatus = PAYDAY_LOAN_STATUS.COMPLETED;
        this.rejectLoanStatus = PAYDAY_LOAN_STATUS.WITHDRAW;
        break;

      default:
        this.nextLoanStatus = PAYDAY_LOAN_STATUS.UNKNOWN_STATUS;
        this.rejectLoanStatus = PAYDAY_LOAN_STATUS.UNKNOWN_STATUS;
        break;
    }

    this.nextLoanStatusDisplay = this.multiLanguageService.instant(
      `payday_loan.status.${this.nextLoanStatus.toLowerCase()}`
    );
    this.rejectLoanStatusDisplay = this.multiLanguageService.instant(
      `payday_loan.status.${this.rejectLoanStatus.toLowerCase()}`
    );

    return;
  }

  formatTime(time) {
    if (!time) return;
    return moment(new Date(time), 'YYYY-MM-DD HH:mm:ss').format(
      'DD/MM/YYYY HH:mm A'
    );
  }
  ngOnDestroy() {
    this.subManager.unsubscribe();
  }
}
