import { NotificationService } from 'src/app/core/services/notification.service';
import { ToastrService } from 'ngx-toastr';
import { UpdateLoanStatusRequest } from './../../../../../../../open-api-modules/loanapp-tng-api-docs/model/updateLoanStatusRequest';
import { Subscription } from 'rxjs';
import { PaydayLoanControllerService as PaydayLoanHmgControllerService } from './../../../../../../../open-api-modules/loanapp-hmg-api-docs/api/paydayLoanController.service';
import { PaydayLoanControllerService as PaydayLoanTngControllerService } from './../../../../../../../open-api-modules/loanapp-tng-api-docs/api/paydayLoanController.service';
import {
  APPLICATION_TYPE,
  COMPANY_NAME,
  PAYDAY_LOAN_STATUS,
} from '../../../../../core/common/enum/payday-loan';
import {
  BUTTON_TYPE,
  DATA_CELL_TYPE,
  DATA_STATUS_TYPE,
} from '../../../../../core/common/enum/operator';
import { MultiLanguageService } from '../../../../../share/translate/multiLanguageService';
import { MatDialog } from '@angular/material/dialog';
import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import * as moment from 'moment';
import {
  CustomerInfo,
  PaydayLoanHmg,
  Voucher,
} from 'open-api-modules/dashboard-api-docs';
import { FormBuilder, FormGroup } from '@angular/forms';
import formatPunishStartTimeHmg from '../../../../../core/utils/format-punish-start-time-hmg';
import formatPunishStartTimeTng from '../../../../../core/utils/format-punish-start-time-tng';
import formatPunishCountHmg from '../../../../../core/utils/format-punish-count-hmg';
import formatPunishCountTng from '../../../../../core/utils/format-punish-count-tng';
import { GlobalConstants } from '../../../../../core/common/global-constants';
import { NgxPermissionsService } from 'ngx-permissions';

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

  @Input() groupName: string;

  leftColumn: any[] = [];
  middleColumn: any[] = [];
  rightColumn: any[] = [];
  serviceFeeHmg: any[] = [];
  serviceFeeTng: any[] = [];
  nextLoanStatus: string = PAYDAY_LOAN_STATUS.UNKNOWN_STATUS;
  nextLoanStatusDisplay: string;
  prevLoanStatus: string;
  prevLoanStatusDisplay: string;
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
    this.maxLoanAmount = this.getMaxLoanAmount(
      this.loanDetail?.companyInfo?.groupName
    );
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
        title: this.multiLanguageService.instant(
          'payday_loan.service_fee.service_fee'
        ),
        subTitle: this.multiLanguageService.instant(
          'payday_loan.service_fee.service_fee_hmg'
        ),
        value: this.calculateServiceFee(this.loanDetail),
        type: DATA_CELL_TYPE.CURRENCY,
        format: null,
      },
      {
        title: this.multiLanguageService.instant(
          'payday_loan.service_fee.transaction_fee'
        ),
        subTitle: this.multiLanguageService.instant(
          'payday_loan.service_fee.transaction_fee_description'
        ),
        value: GlobalConstants.PL_VALUE_DEFAULT.TRANSACTION_FEE,
        type: DATA_CELL_TYPE.CURRENCY,
        format: null,
      },
      {
        title: this.multiLanguageService.instant(
          'payday_loan.service_fee.discount_fee'
        ),
        subTitle: null,
        value: this.getDiscountValue(this.loanDetail?.voucher),
        type: DATA_CELL_TYPE.CURRENCY,
        format: null,
      },
      {
        title: this.multiLanguageService.instant(
          'payday_loan.service_fee.total_fee'
        ),
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
        title: this.multiLanguageService.instant(
          'payday_loan.service_fee.service_fee'
        ),
        subTitle: this.multiLanguageService.instant(
          'payday_loan.service_fee.service_fee_tng'
        ),
        value: this.calculateServiceFee(this.loanDetail),
        type: DATA_CELL_TYPE.CURRENCY,
        format: null,
      },
      {
        title: this.multiLanguageService.instant(
          'payday_loan.service_fee.transaction_fee'
        ),
        subTitle: this.multiLanguageService.instant(
          'payday_loan.service_fee.transaction_fee_description'
        ),
        value: GlobalConstants.PL_VALUE_DEFAULT.TRANSACTION_FEE,
        type: DATA_CELL_TYPE.CURRENCY,
        format: null,
      },
      {
        title: this.multiLanguageService.instant(
          'payday_loan.service_fee.discount_fee'
        ),
        subTitle: null,
        value: this.getDiscountValue(this.loanDetail?.voucher),
        type: DATA_CELL_TYPE.CURRENCY,
        format: null,
      },
      {
        title: this.multiLanguageService.instant(
          'payday_loan.service_fee.vat_fee'
        ),
        subTitle: this.multiLanguageService.instant(
          'payday_loan.service_fee.vat_fee_description'
        ),
        value:
          GlobalConstants.PL_VALUE_DEFAULT.TAX_FEE_TNG *
          (this.calculateServiceFee(this.loanDetail) -
            this.getDiscountValue(this.loanDetail?.voucher)),
        type: DATA_CELL_TYPE.CURRENCY,
        format: null,
      },
      {
        title: this.multiLanguageService.instant(
          'payday_loan.service_fee.total_fee'
        ),
        subTitle: null,
        value: this.loanDetail?.totalServiceFees,
        type: DATA_CELL_TYPE.CURRENCY,
        format: null,
      },
    ];
  }

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
          this.confirmChangeStatus(newStatus);
        }
      })
    );
  }

  hasPermissionChangeStatus(status) {
    let canDoPermissions = [];
    switch (this.groupName) {
      case COMPANY_NAME.TNG:
        canDoPermissions.push(this.hasPermissionChangeStatusTngLoan(status));
        break;
      case COMPANY_NAME.HMG:
        canDoPermissions.push(this.hasPermissionChangeStatusHmgLoan(status));
        break;
      case COMPANY_NAME.VAC:
        canDoPermissions.push(this.hasPermissionChangeStatusVACLoan(status));
        break;
      default:
        break;
    }
    console.log('canDoPermissions', canDoPermissions);
    return canDoPermissions;
  }

  private hasPermissionChangeStatusTngLoan(status) {
    switch (status) {
      case PAYDAY_LOAN_STATUS.INITIALIZED:
        return 'paydays:updateStatusInitializeTngLoan';
      case PAYDAY_LOAN_STATUS.AUCTION:
        return 'paydays:updateStatusPendingForMatchingTngLoan';
      case PAYDAY_LOAN_STATUS.DOCUMENT_AWAITING:
        return 'paydays:updateStatusDocumentAwaitingTngLoan';
      case PAYDAY_LOAN_STATUS.DOCUMENTATION_COMPLETE:
        return 'paydays:updateStatusDocumentCompleteTngLoan';
      case PAYDAY_LOAN_STATUS.FUNDED:
        return 'paydays:updateStatusAwaitingContractTngLoan';
      case PAYDAY_LOAN_STATUS.CONTRACT_ACCEPTED:
        return 'paydays:updateStatusContractAcceptedTngLoan';
      case PAYDAY_LOAN_STATUS.AWAITING_DISBURSEMENT:
        return 'paydays:updateStatusAwaitingDisbursementTngLoan';
      case PAYDAY_LOAN_STATUS.DISBURSED:
        return 'paydays:updateStatusDisbursedTngLoan';
      case PAYDAY_LOAN_STATUS.IN_REPAYMENT:
        return 'paydays:updateStatusUnderRepaymentTngLoan';
      case PAYDAY_LOAN_STATUS.COMPLETED:
        return 'paydays:updateStatusCompletedTngLoan';
      case PAYDAY_LOAN_STATUS.REJECTED:
        return 'paydays:updateStatusRejectedTngLoan';
      case PAYDAY_LOAN_STATUS.WITHDRAW:
        return 'paydays:updateStatusWithdrawTngLoan';
      case PAYDAY_LOAN_STATUS.CONTRACT_REJECTED:
        return 'paydays:updateStatusContractRejectTngLoan';
      default:
        return 'paydays:changeLoanStatusTng';
    }
  }

  private async hasPermissionChangeStatusHmgLoan(status) {
    return 'hmgPaydayLoans:changeLoanStatus';
  }

  private async hasPermissionChangeStatusVACLoan(status) {
    switch (status) {
      case PAYDAY_LOAN_STATUS.INITIALIZED:
        return 'paydays:updateStatusInitializeVacLoan';
      case PAYDAY_LOAN_STATUS.AUCTION:
        return 'paydays:updateStatusPendingForMatchingVacLoan';
      case PAYDAY_LOAN_STATUS.DOCUMENT_AWAITING:
        return 'paydays:updateStatusDocumentAwaitingVacLoan';
      case PAYDAY_LOAN_STATUS.DOCUMENTATION_COMPLETE:
        return 'paydays:updateStatusDocumentCompleteVacLoan';
      case PAYDAY_LOAN_STATUS.FUNDED:
        return 'paydays:updateStatusAwaitingContractVacLoan';
      case PAYDAY_LOAN_STATUS.CONTRACT_ACCEPTED:
        return 'paydays:updateStatusContractAcceptedVacLoan';
      case PAYDAY_LOAN_STATUS.AWAITING_DISBURSEMENT:
        return 'paydays:updateStatusAwaitingDisbursementVacLoan';
      case PAYDAY_LOAN_STATUS.DISBURSED:
        return 'paydays:updateStatusDisbursedVacLoan';
      case PAYDAY_LOAN_STATUS.IN_REPAYMENT:
        return 'paydays:updateStatusUnderRepaymentVacLoan';
      case PAYDAY_LOAN_STATUS.COMPLETED:
        return 'paydays:updateStatusCompletedVacLoan';
      case PAYDAY_LOAN_STATUS.REJECTED:
        return 'paydays:updateStatusRejectedVacLoan';
      case PAYDAY_LOAN_STATUS.WITHDRAW:
        return 'paydays:updateStatusWithdrawVacLoan';
      case PAYDAY_LOAN_STATUS.CONTRACT_REJECTED:
        return 'paydays:updateStatusContractRejectVacLoan';
      default:
        return 'paydays:changeLoanStatusVac';
    }
  }

  confirmChangeStatus(newStatus) {
    const updateLoanStatusRequest: UpdateLoanStatusRequest = {
      customerId: this.loanDetail.customerId,
      status: newStatus,
      applicationType: APPLICATION_TYPE.PDL_TNG,
    };

    switch (this.groupName) {
      case COMPANY_NAME.HMG:
        updateLoanStatusRequest.applicationType = APPLICATION_TYPE.PDL_HMG;
        this.changePaydayLoanHMGStatus(updateLoanStatusRequest);
        break;
      case COMPANY_NAME.TNG:
        updateLoanStatusRequest.applicationType = APPLICATION_TYPE.PDL_TNG;
        this.changePaydayLoanStatus(updateLoanStatusRequest);
        break;
      case COMPANY_NAME.VAC:
        updateLoanStatusRequest.applicationType = APPLICATION_TYPE.PDL_VAC;
        this.changePaydayLoanStatus(updateLoanStatusRequest);
        break;
      default:
        break;
    }
  }

  changePaydayLoanHMGStatus(updateLoanStatusRequest: UpdateLoanStatusRequest) {
    this.subManager.add(
      this.paydayLoanHmgControllerService
        .changeLoanStatus(this.loanDetail.id, updateLoanStatusRequest)
        .subscribe((result) => {
          if (result?.responseCode === 200) {
            this.loanDetailDetectChangeStatus.emit();
          } else {
            this.notifier.error(JSON.stringify(result?.message));
          }
        })
    );
  }

  changePaydayLoanStatus(updateLoanStatusRequest: UpdateLoanStatusRequest) {
    this.subManager.add(
      this.paydayLoanTngControllerService
        .changeLoanStatus(this.loanDetail.id, updateLoanStatusRequest)
        .subscribe((result) => {
          if (result?.responseCode === 200) {
            this.loanDetailDetectChangeStatus.emit();
          } else {
            this.notifier.error(JSON.stringify(result?.message));
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
  getMaxLoanAmount(companyGroupName: string) {
    if (companyGroupName === COMPANY_NAME.HMG) {
      return this.getMaxHMGValue(this.customerInfo?.annualIncome);
    } else {
      return this.getMaxTNGValue(this.customerInfo?.annualIncome);
    }
  }

  getMaxTNGValue(annualIncome) {
    let millionAnnualIncome =
      (this.getPercentOfSalaryByDay() * annualIncome) / 1000000;
    if (millionAnnualIncome % 1 >= 0.5) {
      return (Math.round(millionAnnualIncome) - 0.5) * 1000000;
    }
    return Math.floor(millionAnnualIncome) * 1000000;
  }

  getPercentOfSalaryByDay() {
    let today = moment(new Date(), 'DD/MM/YYYY').format('DD');
    switch (today) {
      case '10':
      case '11':
      case '12':
      case '13':
      case '14':
      case '15':
      case '16':
        return 50.0 / 100;
      case '17':
      case '18':
        return 57.5 / 100;
      case '19':
      case '20':
        return 65.0 / 100;
      case '21':
      case '22':
        return 72.5 / 100;
      default:
        return 80 / 100;
    }
  }

  getMaxHMGValue(annualIncome) {
    let millionAnnualIncome =
      (GlobalConstants.PL_VALUE_DEFAULT.MAX_PERCENT_AMOUNT * annualIncome) /
      1000000;

    if (millionAnnualIncome % 1 >= 0.5) {
      return (Math.round(millionAnnualIncome) - 0.5) * 1000000;
    }

    return Math.floor(millionAnnualIncome) * 1000000;
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
        if (this.groupName === COMPANY_NAME.HMG) {
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
        if (
          this.groupName === COMPANY_NAME.TNG ||
          this.groupName === COMPANY_NAME.VAC
        ) {
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
        this.prevLoanStatus = PAYDAY_LOAN_STATUS.FUNDED;
        this.nextLoanStatus = PAYDAY_LOAN_STATUS.AWAITING_DISBURSEMENT;
        this.rejectLoanStatus = PAYDAY_LOAN_STATUS.WITHDRAW;
        break;

      case PAYDAY_LOAN_STATUS.AWAITING_DISBURSEMENT:
        this.prevLoanStatus = PAYDAY_LOAN_STATUS.CONTRACT_ACCEPTED;
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
    this.prevLoanStatusDisplay = this.prevLoanStatus
      ? this.multiLanguageService.instant(
          `payday_loan.status.${this.prevLoanStatus.toLowerCase()}`
        )
      : null;

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
    if (this.loanDetail?.companyInfo?.groupName === COMPANY_NAME.HMG) {
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
    if (this.loanDetail?.companyInfo?.groupName === COMPANY_NAME.HMG) {
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

  calculateServiceFee(loanDetail) {
    switch (loanDetail?.companyInfo?.name) {
      case COMPANY_NAME.TNG:
      case COMPANY_NAME.VAC:
        if (
          loanDetail?.expectedAmount *
            GlobalConstants.PL_VALUE_DEFAULT.SERVICE_FEE_TNG <
          GlobalConstants.PL_VALUE_DEFAULT.MINIMUM_SERVICE_FEE_TNG
        ) {
          return GlobalConstants.PL_VALUE_DEFAULT.MINIMUM_SERVICE_FEE_TNG;
        } else {
          return (
            loanDetail?.expectedAmount *
            GlobalConstants.PL_VALUE_DEFAULT.SERVICE_FEE_TNG
          );
        }
      case COMPANY_NAME.HMG:
        return (
          loanDetail?.expectedAmount *
          GlobalConstants.PL_VALUE_DEFAULT.SERVICE_FEE_HMG
        );
      default:
        return null;
    }
  }

  getDiscountValue(voucher: Voucher) {
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

  ngOnDestroy() {
    this.subManager.unsubscribe();
  }
}
