import { NotificationService } from 'src/app/core/services/notification.service';
import { ApiResponseCheckIsPaydayByCustomerIdResponse } from './../../../../../../../open-api-modules/customer-api-docs/model/apiResponseCheckIsPaydayByCustomerIdResponse';
import { TngControllerService } from './../../../../../../../open-api-modules/customer-api-docs/api/tngController.service';
import { MatDialog } from '@angular/material/dialog';
import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import {
  Bank,
  CustomerInfo,
} from '../../../../../../../open-api-modules/dashboard-api-docs';
import { CompanyInfo } from '../../../../../../../open-api-modules/dashboard-api-docs';
import { MultiLanguageService } from '../../../../translate/multiLanguageService';
import { DialogCompanyInfoUpdateComponent } from '../dialog-company-info-update/dialog-company-info-update.component';
import {
  BUTTON_TYPE,
  DATA_CELL_TYPE,
  RESPONSE_CODE,
} from '../../../../../core/common/enum/operator';
import { Subscription } from 'rxjs';
import { CustomerDetailService } from '../../../../../pages/customer/components/customer-detail-element/customer-detail.service';
import { ToastrService } from 'ngx-toastr';
``;

@Component({
  selector: 'app-customer-company-info',
  templateUrl: './customer-company-info.component.html',
  styleUrls: ['./customer-company-info.component.scss'],
})
export class CustomerCompanyInfoComponent implements OnInit, OnDestroy {
  @Input() customerInfo: CustomerInfo = {};
  @Input() customerId: string = '';
  @Input() companyInfo: CompanyInfo = {};
  @Input() bankOptions: Array<Bank>;
  @Input() companyOptions: Array<CompanyInfo>;

  @Output() triggerUpdateInfo = new EventEmitter<any>();

  isCanCheckSalary: boolean = false;

  get leftCompanyInfos() {
    return [
      {
        title: this.multiLanguageService.instant(
          'customer.company_info.company_name'
        ),
        value: this.companyInfo.name,
        type: DATA_CELL_TYPE.TEXT,
        format: null,
      },
      {
        title: this.multiLanguageService.instant(
          'customer.company_info.employee_code'
        ),
        value: this.customerInfo.organizationName,
        type: DATA_CELL_TYPE.TEXT,
        format: null,
      },
      {
        title: this.multiLanguageService.instant(
          'loan_app.company_info.working_time'
        ),
        value: this.customerInfo.borrowerEmploymentHistoryTextVariable1,
        type: DATA_CELL_TYPE.TEXT,
        format: null,
      },
      {
        title: this.multiLanguageService.instant(
          'customer.company_info.full_name'
        ),
        value: this.customerInfo.firstName,
        type: DATA_CELL_TYPE.TEXT,
        format: null,
      },
      {
        title: this.multiLanguageService.instant(
          'customer.company_info.first_name'
        ),
        value: this.customerInfo.tngData?.ten,
        type: DATA_CELL_TYPE.TEXT,
        format: null,
      },
      {
        title: this.multiLanguageService.instant(
          'customer.company_info.office_code'
        ),
        value: this.customerInfo.officeCode,
        type: DATA_CELL_TYPE.TEXT,
        format: null,
      },
      {
        title: this.multiLanguageService.instant(
          'customer.company_info.office_name'
        ),
        value: this.customerInfo.officeName,
        type: DATA_CELL_TYPE.TEXT,
        format: null,
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
        format: null,
      },
      {
        title: this.multiLanguageService.instant(
          'customer.company_info.working_days'
        ),
        value: this.customerInfo.workingDay,
        type: DATA_CELL_TYPE.TEXT,
        format: null,
      },
      {
        title: this.multiLanguageService.instant(
          'customer.company_info.account_number'
        ),
        value: this.customerInfo.accountNumber,
        type: DATA_CELL_TYPE.TEXT,
        format: null,
      },
      {
        title: this.multiLanguageService.instant(
          'customer.company_info.bank_name'
        ),
        value: this.customerInfo.bankName,
        type: DATA_CELL_TYPE.TEXT,
        format: null,
      },
      {
        title: this.multiLanguageService.instant(
          'customer.company_info.bank_code'
        ),
        value: this.customerInfo.bankCode,
        type: DATA_CELL_TYPE.TEXT,
        format: null,
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
  subManager = new Subscription();

  constructor(
    private multiLanguageService: MultiLanguageService,
    private dialog: MatDialog,
    private customerDetailService: CustomerDetailService,
    private notifier: ToastrService,
    private tngControllerService: TngControllerService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    if (this.companyInfo.groupName === 'TNG') {
      this.isCanCheckSalary = true;
    }
  }

  openUpdateDialog() {
    const updateDialogRef = this.dialog.open(DialogCompanyInfoUpdateComponent, {
      panelClass: 'custom-info-dialog-container',
      maxWidth: '800px',
      width: '90%',
      data: {
        customerInfo: this.customerInfo,
        customerId: this.customerId,
        bankOptions: this.bankOptions,
        companyOptions: this.companyOptions,
      },
    });

    this.subManager.add(
      updateDialogRef.afterClosed().subscribe((result: any) => {
        if (result && result.type === BUTTON_TYPE.PRIMARY) {
          let updateInfoRequest = this._bindingDialogCompanyInfoData(
            result.data
          );
          this.triggerUpdateInfo.emit(updateInfoRequest);
        }
      })
    );
  }

  private _bindingDialogCompanyInfoData(data) {
    return {
      'personalData.companyId': data?.companyId,
      'personalData.organizationName': data?.employeeCode,
      'tngData.ten': data?.tngFirstName || null,
      'financialData.accountNumber': data?.accountNumber || null,
      'financialData.bankCode': data?.bankCode || null,
      'financialData.bankName': data?.bankName || null,
      'personalData.firstName': data?.firstName,
      'personalData.annualIncome': data?.annualIncome,
      'personalData.workingDay': data?.workingDay,
      'personalData.officeCode': data?.officeCode,
      'personalData.officeName': data?.officeName,
    };
  }

  checkSalaryInfo() {
    this.subManager.add(
      this.tngControllerService
        .checkCustomerInformationSalaryReceiptDate(this.customerId)
        .subscribe((response: ApiResponseCheckIsPaydayByCustomerIdResponse) => {
          if (response && response.responseCode === 200) {
            let paydayNotification: string;
            let imgNotification : string;
            if (response.result.isPayday === 'false') {
              paydayNotification = this.multiLanguageService.instant(
                'loan_app.company_info.is_not_payday'
              );
              imgNotification =
                'assets/img/payday-loan/warning-prompt-icon.png';
            } else {
              paydayNotification = this.multiLanguageService.instant(
                'loan_app.company_info.is_payday'
              );
              imgNotification =
                'assets/img/payday-loan/success-prompt-icon.png';
            }

            this.notificationService.openPrompt({
              title: this.multiLanguageService.instant('common.error'),
              content: paydayNotification,
              imgUrl: imgNotification,
              primaryBtnText: this.multiLanguageService.instant('common.ok'),
            });
          }
        })
    );
  }

  ngOnDestroy(): void {
    this.subManager.unsubscribe();
  }
}
