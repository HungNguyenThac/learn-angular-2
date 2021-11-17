import { MatDialog } from '@angular/material/dialog';
import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { MultiLanguageService } from '../../../../share/translate/multiLanguageService';
import {
  Bank,
  CustomerInfo,
} from '../../../../../../open-api-modules/dashboard-api-docs';
import { CustomerDetailUpdateDialogComponent } from '../customer-individual-info-update-dialog/customer-detail-update-dialog.component';
import { Subscription } from 'rxjs';
import { CustomerDetailService } from '../customer-detail-element/customer-detail.service';
import {
  BUTTON_TYPE,
  DATA_CELL_TYPE,
  LOCK_TIME_OPTIONS,
  LOCK_TIME_TEXT_OPTIONS,
} from '../../../../core/common/enum/operator';
import { ToastrService } from 'ngx-toastr';
import { FormBuilder, FormGroup } from '@angular/forms';
import { VirtualAccount } from '../../../../../../open-api-modules/payment-api-docs';
import * as moment from 'moment';
import { AddNewUserDialogComponent } from '../../../../share/components/operators/user-account/add-new-user-dialog/add-new-user-dialog.component';
import { PlPromptComponent } from '../../../../share/components';
import { NotificationService } from '../../../../core/services/notification.service';

@Component({
  selector: 'app-customer-individual-info',
  templateUrl: './customer-individual-info.component.html',
  styleUrls: ['./customer-individual-info.component.scss'],
})
export class CustomerIndividualInfoComponent implements OnInit, OnDestroy {
  customerIndividualForm: FormGroup;
  subManager = new Subscription();
  selfieSrc: string;
  diableTime: string;
  showDisableOption: boolean = true;
  timeDisableOptions: any = [
    {
      mainTitle: 'Theo giờ',
      options: [
        {
          title: this.multiLanguageService.instant(
            LOCK_TIME_TEXT_OPTIONS.ONE_HOUR
          ),
          value: LOCK_TIME_OPTIONS.ONE_HOUR,
        },
        {
          title: this.multiLanguageService.instant(
            LOCK_TIME_TEXT_OPTIONS.TWO_HOUR
          ),
          value: LOCK_TIME_OPTIONS.TWO_HOUR,
        },
        {
          title: this.multiLanguageService.instant(
            LOCK_TIME_TEXT_OPTIONS.FOUR_HOUR
          ),
          value: LOCK_TIME_OPTIONS.FOUR_HOUR,
        },
        {
          title: this.multiLanguageService.instant(
            LOCK_TIME_TEXT_OPTIONS.EIGHT_HOUR
          ),
          value: LOCK_TIME_OPTIONS.EIGHT_HOUR,
        },
      ],
    },
    {
      mainTitle: 'Theo ngày',
      options: [
        {
          title: this.multiLanguageService.instant(
            LOCK_TIME_TEXT_OPTIONS.ONE_DAY
          ),
          value: LOCK_TIME_OPTIONS.ONE_DAY,
        },
        {
          title: this.multiLanguageService.instant(
            LOCK_TIME_TEXT_OPTIONS.SEVEN_DAY
          ),
          value: LOCK_TIME_OPTIONS.SEVEN_DAY,
        },
        {
          title: this.multiLanguageService.instant(
            LOCK_TIME_TEXT_OPTIONS.THIRTY_DAY
          ),
          value: LOCK_TIME_OPTIONS.THIRTY_DAY,
        },
      ],
    },
    {
      mainTitle: 'Vĩnh viễn',
      options: [
        {
          title: this.multiLanguageService.instant(
            LOCK_TIME_TEXT_OPTIONS.PERMANENT
          ),
          value: LOCK_TIME_OPTIONS.PERMANENT,
        },
      ],
    },
  ];

  constructor(
    private multiLanguageService: MultiLanguageService,
    private dialog: MatDialog,
    private customerDetailService: CustomerDetailService,
    private notifier: ToastrService,
    private formBuilder: FormBuilder,
    private notificationService: NotificationService
  ) {
    this.customerIndividualForm = this.formBuilder.group({
      note: [''],
    });
  }

  _virtualAccount: VirtualAccount;
  @Input()
  get virtualAccount(): VirtualAccount {
    return this._virtualAccount;
  }

  set virtualAccount(value: VirtualAccount) {
    this._virtualAccount = value;
  }

  _customerInfo: CustomerInfo;
  @Input()
  get customerInfo(): CustomerInfo {
    return this._customerInfo;
  }

  set customerInfo(value: CustomerInfo) {
    this._getSelfieDocument(this.customerId, value);
    this._initIndividualFormData(this.customerId, value);
    this._customerInfo = value;
    this.leftIndividualInfos = this._initLeftIndividualInfos();
    this.rightIndividualInfos = this._initRightIndividualInfos();
  }

  _customerId: string;
  @Input()
  get customerId(): string {
    return this._customerId;
  }

  set customerId(value: string) {
    this._customerId = value;
  }

  _bankOptions: Array<Bank>;
  @Input()
  get bankOptions(): Array<Bank> {
    return this._bankOptions;
  }

  set bankOptions(value: Array<Bank>) {
    this._bankOptions = value;
  }

  @Output() triggerUpdateInfo = new EventEmitter<any>();

  leftIndividualInfos: any[] = [];

  rightIndividualInfos: any[] = [];

  customerIndividualForm: FormGroup;

  ngOnInit(): void {}

  private _initLeftIndividualInfos() {
    return [
      {
        title: this.multiLanguageService.instant('customer.individual_info.id'),
        value: this.customerId,
        type: DATA_CELL_TYPE.TEXT,
        format: null,
      },
      {
        title: this.multiLanguageService.instant(
          'customer.individual_info.fullname'
        ),
        value: this.customerInfo?.firstName,
        type: DATA_CELL_TYPE.TEXT,
        format: null,
      },
      {
        title: this.multiLanguageService.instant(
          'customer.individual_info.phone_number'
        ),
        value: this.customerInfo?.mobileNumber,
        type: DATA_CELL_TYPE.TEXT,
        format: null,
      },
      {
        title: this.multiLanguageService.instant(
          'customer.individual_info.date_of_birth'
        ),
        value: this.customerInfo?.dateOfBirth,
        type: DATA_CELL_TYPE.TEXT,
        format: null,
      },
      {
        title: this.multiLanguageService.instant(
          'customer.individual_info.email'
        ),
        value: this.customerInfo?.emailAddress,
        type: DATA_CELL_TYPE.TEXT,
        format: null,
      },
      {
        title: this.multiLanguageService.instant(
          'customer.individual_info.cmnd'
        ),
        value: this.customerInfo?.identityNumberOne,
        type: DATA_CELL_TYPE.TEXT,
        format: null,
      },
      {
        title: this.multiLanguageService.instant(
          'customer.individual_info.permanent_address'
        ),
        value: this.customerInfo?.addressTwoLine1,
        type: DATA_CELL_TYPE.TEXT,
        format: null,
      },
      {
        title: this.multiLanguageService.instant(
          'customer.individual_info.current_residence'
        ),
        value: this.customerInfo?.addressOneLine1,
        type: DATA_CELL_TYPE.TEXT,
        format: null,
      },
      {
        title: this.multiLanguageService.instant(
          'customer.individual_info.id_origin'
        ),
        value: this.customerInfo?.idOrigin,
        type: DATA_CELL_TYPE.TEXT,
        format: null,
      },
    ];
  }

  private _initRightIndividualInfos() {
    return [
      {
        title: this.multiLanguageService.instant(
          'customer.individual_info.number_of_dependents'
        ),
        value: this.customerInfo?.borrowerDetailTextVariable1,
        type: DATA_CELL_TYPE.TEXT,
        format: null,
      },
      {
        title: this.multiLanguageService.instant(
          'customer.individual_info.marital_status'
        ),
        value: this.customerInfo?.maritalStatus,
        type: DATA_CELL_TYPE.TEXT,
        format: null,
      },
      {
        title: this.multiLanguageService.instant(
          'customer.individual_info.bank_account_number'
        ),
        value: this.customerInfo?.accountNumber,
        type: DATA_CELL_TYPE.TEXT,
        format: null,
      },
      {
        title: this.multiLanguageService.instant(
          'customer.individual_info.bank_name'
        ),
        value:
          this.customerInfo?.bankName || this.customerInfo?.bankCode
            ? `${this.customerInfo?.bankName} ( ${this.customerInfo?.bankCode} )`
            : null,
        type: DATA_CELL_TYPE.TEXT,
        format: null,
      },
      {
        title: this.multiLanguageService.instant(
          'customer.individual_info.va_account_number'
        ),
        value: this.virtualAccount?.accountNumber,
        type: DATA_CELL_TYPE.TEXT,
        format: null,
      },
      {
        title: this.multiLanguageService.instant(
          'customer.individual_info.created_at'
        ),
        value: this.customerInfo?.createdAt,
        type: DATA_CELL_TYPE.DATETIME,
        format: 'dd/MM/yyyy HH:mm',
      },
      {
        title: this.multiLanguageService.instant(
          'customer.individual_info.updated_at'
        ),
        value: this.customerInfo?.updatedAt,
        type: DATA_CELL_TYPE.DATETIME,
        format: 'dd/MM/yyyy HH:mm',
      },
      {
        title: this.multiLanguageService.instant(
          'customer.individual_info.updated_by'
        ),
        value: this.customerInfo?.updatedBy,
        type: DATA_CELL_TYPE.TEXT,
        format: null,
      },
    ];
  }

  openUpdateDialog() {
    const updateDialogRef = this.dialog.open(
      CustomerDetailUpdateDialogComponent,
      {
        panelClass: 'custom-info-dialog-container',
        maxWidth: '1200px',
        width: '90%',
        data: {
          customerInfo: this.customerInfo,
          customerId: this.customerId,
          virtualAccount: this.virtualAccount,
          bankOptions: this.bankOptions,
          selfieSrc: this.selfieSrc,
        },
      }
    );
    this.subManager.add(
      updateDialogRef.afterClosed().subscribe((result: any) => {
        if (result && result.type === BUTTON_TYPE.PRIMARY) {
          let updateInfoRequest = this._bindingDialogIndividualData(
            result.data
          );
          this.triggerUpdateInfo.emit(updateInfoRequest);
        }
      })
    );
  }

  public displayDisableOption() {
    const disableForm = document.getElementById('disableMethod');
    if (window.getComputedStyle(disableForm, null).display === 'none') {
      disableForm.setAttribute('style', 'display:block');
    } else {
      disableForm.setAttribute('style', 'display:none');
    }
  }

  public chooseDisableTime(title, value, element) {
    element.style.display = 'none';
    const confirmDisableRef = this.notificationService.openPrompt({
      imgUrl: '../../../../../assets/img/icon/group-5/Alert.svg',
      title:
        value === LOCK_TIME_OPTIONS.PERMANENT
          ? this.multiLanguageService.instant(
              'customer.individual_info.disable_customer.dialog_title_permanent'
            )
          : this.multiLanguageService.instant(
              'customer.individual_info.disable_customer.dialog_title',
              {
                time: title,
              }
            ),
      content: this.multiLanguageService.instant(
        'customer.individual_info.disable_customer.dialog_content'
      ),
      primaryBtnText: this.multiLanguageService.instant('common.lock'),
      primaryBtnClass: 'btn-error',
      secondaryBtnText: this.multiLanguageService.instant('common.skip'),
    });
    confirmDisableRef.afterClosed().subscribe((result) => {
      if (result === 'PRIMARY') {
        this.showDisableOption = false;
      }
    });
  }

  public displayEnableOption() {
    const confirmEnableRef = this.notificationService.openPrompt({
      imgUrl: '../../../../../assets/img/icon/group-5/unlock-dialog.svg',
      title: this.multiLanguageService.instant(
        'customer.individual_info.enable_customer.dialog_title'
      ),
      content: '',
      primaryBtnText: this.multiLanguageService.instant('common.allow'),
      primaryBtnClass: 'btn-primary',
      secondaryBtnText: this.multiLanguageService.instant('common.skip'),
    });
    confirmEnableRef.afterClosed().subscribe((result) => {
      if (result === 'PRIMARY') {
        this.showDisableOption = true;
      }
    });
  }

  submitForm() {
    const data = this.customerIndividualForm.getRawValue();
    this.triggerUpdateInfo.emit({
      'personalData.note': data.note,
    });
  }

  formatTime(timeInput) {
    if (!timeInput) return;
    return moment(new Date(timeInput), 'YYYY-MM-DD HH:mm:ss').format(
      'DD/MM/YYYY'
    );
  }

  ngOnDestroy(): void {
    this.subManager.unsubscribe();
  }

  private _initIndividualFormData(customerId, customerInfo) {
    this.customerIndividualForm.patchValue({
      note: customerInfo?.note,
    });
  }

  private _getSelfieDocument(customerId, customerInfo) {
    if (!customerInfo?.selfie) {
      return;
    }
    this.subManager.add(
      this.customerDetailService
        .downloadSingleFileDocument(customerId, customerInfo?.selfie)
        .subscribe((data) => {
          this.selfieSrc = data;
        })
    );
  }

  private _bindingDialogIndividualData(data) {
    return {
      'financialData.accountNumber': data?.accountNumber || null,
      'financialData.bankCode': data?.bankCode || null,
      'financialData.bankName': data?.bankName || null,
      'personalData.addressOneLine1': data?.currentResidence,
      'personalData.dateOfBirth': data?.dateOfBirth
        ? this.formatTime(data?.dateOfBirth)
        : null,
      'personalData.emailAddress': data?.email,
      'personalData.identityNumberSix': data?.email,
      'personalData.firstName': data?.firstName,
      'personalData.gender': data?.gender,
      'personalData.idOrigin': data?.idOrigin,
      'personalData.identityNumberOne': data?.identityNumberOne,
      'personalData.maritalStatus': data?.maritalStatus,
      'personalData.borrowerDetailTextVariable1': data?.numberOfDependents,
      'personalData.addressTwoLine1': data?.permanentAddress,
      'personalData.mobileNumber': data?.mobileNumber,
    };
  }

  submitForm() {
    const data = this.customerIndividualForm.getRawValue();
    this.triggerUpdateInfo.emit({
      'personalData.note': data.note,
    });
  }

  formatTime(timeInput) {
    if (!timeInput) return;
    return moment(new Date(timeInput), 'YYYY-MM-DD HH:mm:ss').format(
      'DD/MM/YYYY'
    );
  }

  openFullSizeImg(imageSrc) {
    this.notificationService.openImgFullsizeDiaglog({ imageSrc: imageSrc });
  }

}
