import { NotificationService } from 'src/app/core/services/notification.service';
import { ToastrService } from 'ngx-toastr';
import { UpdateLoanStatusRequest } from './../../../../../../../open-api-modules/loanapp-hmg-api-docs/model/updateLoanStatusRequest';
import { Subscription } from 'rxjs';
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
  Voucher,
} from 'open-api-modules/dashboard-api-docs';
import {
  ApiResponseObject,
  PaydayLoan,
} from 'open-api-modules/loanapp-api-docs';
import { FormBuilder, FormGroup } from '@angular/forms';
import {
  ApiResponseString,
  UpdateLoanRequest,
} from 'open-api-modules/loanapp-hmg-api-docs';
import formatPunishStartTimeHmg from '../../../../../core/utils/format-punish-start-time-hmg';
import formatPunishStartTimeTng from '../../../../../core/utils/format-punish-start-time-tng';
import formatPunishCountHmg from '../../../../../core/utils/format-punish-count-hmg';
import formatPunishCountTng from '../../../../../core/utils/format-punish-count-tng';

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
    this.leftColumn = this._initLeftColumn();
    this.middleColumn = this._initMiddleColumn();
    this.rightColumn = this._initRightColumn();
    this._initLoanInfoData();
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
    this.serviceFeeHmg = this._serviceFeeHmg();
    this.serviceFeeTng = this._serviceFeeTng();
    this._initLoanInfoData();
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
        type: DATA_CELL_TYPE.HYPERLINK,
        format: `/customer/list?id__e=${this.loanDetail?.customerId}&accountClassification=ALL`,
      },
      {
        title: this.multiLanguageService.instant(
          'loan_app.loan_info.phone_number'
        ),
        value: this.customerInfo?.mobileNumber,
        type: DATA_CELL_TYPE.HYPERLINK,
        format: `/customer/list?id__e=${this.loanDetail?.customerId}&accountClassification=ALL`,
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
        value: this.loanDetail?.updatedAt,
        type: DATA_CELL_TYPE.DATETIME,
        format: 'dd/MM/yyyy HH:mm',
      },
    ];
  }

  private _initMiddleColumn() {
    this.maxLoanAmount = this.getMaxLoanAmount();
    this.totalSettlementAmount = this.getTotalSettlementAmount();
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
          'loan_app.loan_info.total_service_charge'
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
          'loan_app.loan_info.overdue_date'
        ),
        value: this.getOverdueDate(),
        type: DATA_CELL_TYPE.TEXT,
        format: null,
      },
      {
        title: this.multiLanguageService.instant(
          'loan_app.loan_info.overdue_date_count'
        ),
        value: this.getOverdueDateCount(),
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
        value: this.loanDetail?.personInChargeId,
        type: DATA_CELL_TYPE.TEXT,
        format: null,
      },
    ];
  }

  private _serviceFeeHmg() {
    return [
      {
        title: 'Phí dịch vụ',
        subTitle: '2 % giá trị khoản vay tối thiểu là 100,000 VND',
        value: 0.02 * this.loanDetail?.expectedAmount,
        type: DATA_CELL_TYPE.CURRENCY,
        format: null,
      },
      {
        title: 'Phí xử lý giao dịch',
        subTitle: null,
        value: '11200',
        type: DATA_CELL_TYPE.CURRENCY,
        format: null,
      },
      {
        title: 'Ưu đãi phí',
        subTitle: null,
        value: this.getDiscountValue(this.loanDetail?.voucher),
        type: DATA_CELL_TYPE.CURRENCY,
        format: null,
      },
      {
        title: 'Tổng phí phải trả',
        subTitle: null,
        value: this.loanDetail?.totalServiceFees,
        type: DATA_CELL_TYPE.CURRENCY,
        format: null,
      },
    ];
  }

  private _serviceFeeTng() {
    return [
      {
        title: 'Phí dịch vụ',
        subTitle: '2.5 % giá trị khoản vay tối thiểu là 100,000 VND',
        value: 0.025 * this.loanDetail?.expectedAmount,
        type: DATA_CELL_TYPE.CURRENCY,
        format: null,
      },
      {
        title: 'Phí xử lý giao dịch',
        subTitle: null,
        value: '11200',
        type: DATA_CELL_TYPE.CURRENCY,
        format: null,
      },
      {
        title: 'Phí VAT',
        subTitle: '10% của Phí dịch vụ',
        value: 0.1 * 0.025 * this.loanDetail?.expectedAmount,
        type: DATA_CELL_TYPE.CURRENCY,
        format: null,
      },
      {
        title: 'Ưu đãi phí',
        subTitle: null,
        value: this.getDiscountValue(this.loanDetail?.voucher),
        type: DATA_CELL_TYPE.CURRENCY,
        format: null,
      },
      {
        title: 'Tổng phí phải trả',
        subTitle: null,
        value: this.loanDetail?.totalServiceFees,
        type: DATA_CELL_TYPE.CURRENCY,
        format: null,
      },
    ];
  }

  getDiscountValue(voucher: Voucher) {
    console.log(voucher);
    if (!voucher) {
      return 0;
    }
    let discountAmount =
      voucher.percentage * 0.025 * this.loanDetail?.expectedAmount;
    // check max discount accepted
    if (discountAmount > voucher.maxValue) {
      return (discountAmount = voucher.maxValue);
    }
    return discountAmount;
  }

  leftColumn: any[] = [];
  middleColumn: any[] = [];
  rightColumn: any[] = [];
  serviceFeeHmg: any[] = [];
  serviceFeeTng: any[] = [];

  currentTime = new Date();

  @Input() groupName: string;
  nextLoanStatus: string = PAYDAY_LOAN_STATUS.UNKNOWN_STATUS;
  nextLoanStatusDisplay: string;
  rejectLoanStatus: string = PAYDAY_LOAN_STATUS.UNKNOWN_STATUS;
  rejectLoanStatusDisplay: string;
  salaryStatus: string;
  loanInfoForm: FormGroup;
  totalSettlementAmount: number;
  maxLoanAmount: number;

  subManager = new Subscription();
  @Output() loanDetailDetectChangeStatus = new EventEmitter<any>();

  constructor(
    private multiLanguageService: MultiLanguageService,
    private dialog: MatDialog,
    private paydayLoanHmgControllerService: PaydayLoanHmgControllerService,
    private paydayLoanTngControllerService: PaydayLoanTngControllerService,
    private notificationService: NotificationService,
    private notifier: ToastrService,
    private formBuilder: FormBuilder
  ) {
    this.loanInfoForm = this.formBuilder.group({
      note: [''],
    });
  }

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
                  this.loanDetailDetectChangeStatus.emit();
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
                  this.loanDetailDetectChangeStatus.emit();
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
  getMaxLoanAmount() {
    return this.customerInfo?.annualIncome * 0.8;
  }

  //Tổng tiền tất toán
  getTotalSettlementAmount() {
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
        if (this.groupName === 'HMG') {
          this.nextLoanStatus = PAYDAY_LOAN_STATUS.DOCUMENTATION_COMPLETE;
          this.rejectLoanStatus = PAYDAY_LOAN_STATUS.WITHDRAW;
          break;
        }
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
        this.nextLoanStatus = PAYDAY_LOAN_STATUS.UNKNOWN_STATUS;
        this.rejectLoanStatus = PAYDAY_LOAN_STATUS.WITHDRAW;
        break;

      case PAYDAY_LOAN_STATUS.CONTRACT_AWAITING:
        this.nextLoanStatus = PAYDAY_LOAN_STATUS.UNKNOWN_STATUS;
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
        this.rejectLoanStatus = PAYDAY_LOAN_STATUS.UNKNOWN_STATUS;
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
      `payday_loan.status.${this.rejectLoanStatus.toLowerCase()}_action`
    );

    return;
  }

  formatTime(time) {
    if (!time) return;
    return moment(new Date(time), 'YYYY-MM-DD HH:mm:ss').format(
      'DD/MM/YYYY HH:mm A'
    );
  }

  private _initLoanInfoData() {
    this.loanInfoForm.patchValue({
      note: this.loanDetail?.note,
    });
  }

  getOverdueDate() {
    if (this.loanDetail?.companyGroupName === 'HMG') {
      return formatPunishStartTimeHmg(
        this.loanDetail?.createdAt,
        this.loanDetail?.expectedTenure
      );
    } else {
      return formatPunishStartTimeTng(
        this.loanDetail?.createdAt,
        this.loanDetail?.expectedTenure
      );
    }
  }

  getOverdueDateCount() {
    if (this.loanDetail?.companyGroupName === 'HMG') {
      return formatPunishCountHmg(
        this.loanDetail?.createdAt,
        this.loanDetail?.expectedTenure
      );
    } else {
      return formatPunishCountTng(
        this.loanDetail?.createdAt,
        this.loanDetail?.expectedTenure
      );
    }
  }

  ngOnDestroy() {
    this.subManager.unsubscribe();
  }
}
