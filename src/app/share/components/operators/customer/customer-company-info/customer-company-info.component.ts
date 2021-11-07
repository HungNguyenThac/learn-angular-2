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

@Component({
  selector: 'app-customer-company-info',
  templateUrl: './customer-company-info.component.html',
  styleUrls: ['./customer-company-info.component.scss'],
})
export class CustomerCompanyInfoComponent implements OnInit, OnDestroy {
  @Input() customerInfo: CustomerInfo = {};
  @Input() customerId: string = '';
  @Input() bankOptions: Array<Bank>;
  @Input() companyOptions: Array<CompanyInfo>;

  @Output() triggerUpdateInfo = new EventEmitter<any>();

  get leftCompanyInfos() {
    return [
      {
        title: this.multiLanguageService.instant(
          'customer.company_info.company_name'
        ),
        value: this.customerInfo.companyName,
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
          'customer.company_info.last_name'
        ),
        value: this.customerInfo.tngData?.hoDem,
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
    private notifier: ToastrService
  ) {}

  ngOnInit(): void {}

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
      'tngData.ho': data?.tngLastName || null,
      'personalData.annualIncome': data?.annualIncome,
      'personalData.workingDay': data?.workingDay,
      'personalData.officeCode': data?.officeCode,
      'personalData.officeName': data?.officeName,
    };
  }

  ngOnDestroy(): void {
    this.subManager.unsubscribe();
  }
}
