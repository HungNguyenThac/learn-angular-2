import { PaydayLoanTng } from './../../../../../../../open-api-modules/dashboard-api-docs/model/paydayLoanTng';
import { FileControllerService } from './../../../../../../../open-api-modules/com-api-docs/api/fileController.service';
import { PaydayLoanControllerService } from './../../../../../../../open-api-modules/loanapp-tng-api-docs/api/paydayLoanController.service';
import { DOCUMENT_BTN_TYPE } from 'src/app/core/common/enum/operator';
import { RESPONSE_CODE } from './../../../../../core/common/enum/operator';
import { UpdatedDocumentModel } from './../../../../../public/models/external/updated-document.model';
import { CustomerDetailService } from 'src/app/pages/customer/components/customer-detail-element/customer-detail.service';
import {
  DOCUMENT_TYPE,
  DOCUMENT_TYPE_MAPPING_FIELD,
  ERROR_CODE_KEY,
  PAYDAY_LOAN_STATUS,
} from './../../../../../core/common/enum/payday-loan';
import { ConfirmationDialog } from './../../../../../share/components/dialogs/confirmation-dialog/confirmation-dialog.component';
import { ToastrService } from 'ngx-toastr';
import { MatDialog } from '@angular/material/dialog';
import { NotificationService } from 'src/app/core/services/notification.service';
import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Inject,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import {
  Bank,
  CompanyInfo,
  CustomerInfo,
} from '../../../../../../../open-api-modules/dashboard-api-docs';
import { BUTTON_TYPE } from '../../../../../core/common/enum/operator';
import { takeUntil } from 'rxjs/operators';
import { forkJoin, Subject, Subscription } from 'rxjs';
import { MultiLanguageService } from 'src/app/share/translate/multiLanguageService';
import { NgxPermissionsService } from 'ngx-permissions';
import { DomSanitizer } from '@angular/platform-browser';
import { InfoControllerService } from 'open-api-modules/customer-api-docs';
import {
  EmployeeData,
  EmployeeDataRequest,
  PaydayLoan,
} from 'open-api-modules/loanapp-tng-api-docs';
import { ApiResponseObject } from 'open-api-modules/com-api-docs';
import * as moment from 'moment';

@Component({
  selector: 'app-info-verification',
  templateUrl: './info-verification.component.html',
  styleUrls: ['./info-verification.component.scss'],
})
export class InfoVerificationComponent implements OnInit, AfterViewInit {
  @Input() customerInfo: CustomerInfo;
  // _customerInfo: CustomerInfo;
  // get customerInfo(): CustomerInfo {
  //   return this._customerInfo;
  // }

  // set customerInfo(value: CustomerInfo) {
  //   // this._getDocumentByPath(value.id, value);
  //   this._customerInfo = value;
  // }

  @Input() bankOptions: Array<Bank>;
  // @Input() loanDetail: PaydayLoan;
  _loanDetail: PaydayLoanTng;
  @Input() get loanDetail(): PaydayLoanTng {
    return this._loanDetail;
  }

  set loanDetail(value: PaydayLoanTng) {
    // this._getDocumentByPath(value.id, value);
    this._loanDetail = value;
    this.initInfoVerificationFormData();
  }

  @Input() loanId: string;
  @Output() loanDetailDetectChangeStatus = new EventEmitter<any>();

  infoVerificationForm: FormGroup;

  leftInfos = [
    {
      title: this.multiLanguageService.instant(
        'loan_app.info_verification.customer_name'
      ),
      value: 'name',
      type: 'text',
    },
    {
      title: this.multiLanguageService.instant(
        'loan_app.info_verification.mobile_number'
      ),
      value: 'mobile',
      type: 'number',
    },
    {
      title: this.multiLanguageService.instant(
        'loan_app.info_verification.identity_number'
      ),
      value: 'identityNumber',
      type: 'number',
    },
    {
      title: this.multiLanguageService.instant(
        'loan_app.info_verification.start_working_day'
      ),
      value: 'startWorkingDay',
      type: 'date',
    },
    {
      title: this.multiLanguageService.instant(
        'loan_app.info_verification.contract_type'
      ),
      value: 'contractType',
      type: 'text',
    },
    {
      title: this.multiLanguageService.instant(
        'loan_app.info_verification.current_job'
      ),
      value: 'job',
      type: 'text',
    },
    {
      title: this.multiLanguageService.instant(
        'loan_app.info_verification.address'
      ),
      value: 'address',
      type: 'text',
    },
  ];

  rightInfos = [
    {
      title: this.multiLanguageService.instant(
        'loan_app.info_verification.current_month_working_days_number'
      ),
      value: 'numberOfWorkDays',
      type: 'number',
    },
    // {
    //   title: this.multiLanguageService.instant(
    //     'loan_app.info_verification.salary_bank'
    //   ),
    //   value: 'bank',
    //   type: 'text',
    // },
    {
      title: this.multiLanguageService.instant(
        'loan_app.info_verification.salary_bank_number'
      ),
      value: 'accountNumber',
      type: 'number',
    },
  ];

  salary1Src: any;
  salary2Src: any;
  salary3Src: any;
  salaryPathArray: string[] = [];
  documentTypes = DOCUMENT_TYPE;
  hiddenUploadBtn: boolean = false;
  hiddenDeleteBtn: boolean = false;
  hiddenDownloadBtn: boolean = true;

  subManager = new Subscription();

  @ViewChild('inputEle') inputEleRef: ElementRef<HTMLInputElement>;

  constructor(
    private multiLanguageService: MultiLanguageService,
    private formBuilder: FormBuilder,
    private notificationService: NotificationService,
    private dialog: MatDialog,
    private notifier: ToastrService,
    private permissionsService: NgxPermissionsService,
    private customerDetailService: CustomerDetailService,
    private infoControllerService: InfoControllerService,
    private domSanitizer: DomSanitizer,
    private paydayLoanControllerService: PaydayLoanControllerService,
    private fileControllerService: FileControllerService
  ) {
    this.infoVerificationForm = this.formBuilder.group({
      name: ['', Validators.required],
      mobile: ['', Validators.required],
      identityNumber: ['', Validators.required],
      startWorkingDay: ['', Validators.required],
      contractType: ['', Validators.required],
      job: ['', Validators.required],
      address: ['', Validators.required],
      numberOfWorkDays: ['', Validators.required],
      bank: ['', Validators.required],
      accountNumber: ['', Validators.required],
      salaryInfomationOne: [Blob, Validators.required],
      salaryInfomationTwo: [Blob, Validators.required],
      salaryInfomationThree: [Blob, Validators.required],
    });
  }

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    // this.inputEleRef.nativeElement.focus();
    // this.initInfoVerificationFormData();
  }

  private _initSubscription() {
    this.subManager.add(
      this.permissionsService.permissions$.subscribe((permissions) => {
        if (permissions) {
          this._checkActionPermissions();
        }
      })
    );
  }

  private initInfoVerificationFormData() {
    console.log(this.loanDetail.status, 'aaaa');

    if (
      this.loanDetail.status !==
      (PAYDAY_LOAN_STATUS.DOCUMENT_AWAITING &&
        PAYDAY_LOAN_STATUS.INITIALIZED &&
        PAYDAY_LOAN_STATUS.UNKNOWN_STATUS)
    ) {
      // this.infoVerificationForm.patchValue(this.loanDetail.employeeData);
      // this._getSingleFileDocumentByPath(
      //   this.loanDetail.customerId,
      //   this.loanDetail.employeeData.salaryDocument1,
      //   DOCUMENT_TYPE.SALARY_INFORMATION_ONE
      // );
      // this._getSingleFileDocumentByPath(
      //   this.loanDetail.customerId,
      //   this.loanDetail.employeeData.salaryDocument2,
      //   DOCUMENT_TYPE.SALARY_INFORMATION_TWO
      // );
      // this._getSingleFileDocumentByPath(
      //   this.loanDetail.customerId,
      //   this.loanDetail.employeeData.salaryDocument3,
      //   DOCUMENT_TYPE.SALARY_INFORMATION_THREE
      // );
    }
  }

  private _getDocumentByPath(customerId: string, customerInfo: CustomerInfo) {
    if (!customerId || !customerInfo) {
      return;
    }

    if (customerInfo?.salaryDocument1) {
      this._getSingleFileDocumentByPath(
        customerId,
        customerInfo?.salaryDocument1,
        DOCUMENT_TYPE.SALARY_INFORMATION_ONE
      );
    }

    if (customerInfo?.salaryDocument2) {
      this._getSingleFileDocumentByPath(
        customerId,
        customerInfo?.salaryDocument2,
        DOCUMENT_TYPE.SALARY_INFORMATION_TWO
      );
    }

    if (customerInfo?.salaryDocument3) {
      this._getSingleFileDocumentByPath(
        customerId,
        customerInfo?.salaryDocument3,
        DOCUMENT_TYPE.SALARY_INFORMATION_THREE
      );
    }
  }

  private _getCurrentDocumentUploaded(
    documentType: DOCUMENT_TYPE,
    customerInfo: CustomerInfo
  ) {
    if (!documentType || !customerInfo) {
      return;
    }

    return this._getSingleFileDocumentByPath(
      customerInfo.id,
      customerInfo?.salaryDocument2,
      documentType
    );
  }

  private _getSingleFileDocumentByPath(
    customerId: string,
    documentPath: string,
    documentType: DOCUMENT_TYPE
  ) {
    if (!customerId || !documentPath || !documentType) {
      return;
    }
    this.subManager.add(
      this.customerDetailService
        .downloadSingleFileDocument(customerId, documentPath)
        .subscribe((data) => {
          this._mapDocumentSrc(data, documentType);
        })
    );
  }

  private _mapDocumentSrc(data: any, documentType: DOCUMENT_TYPE) {
    switch (documentType) {
      case DOCUMENT_TYPE.SALARY_INFORMATION_ONE:
        this.salary1Src = data;
        break;
      case DOCUMENT_TYPE.SALARY_INFORMATION_TWO:
        this.salary2Src = data;
        break;
      case DOCUMENT_TYPE.SALARY_INFORMATION_THREE:
        this.salary3Src = data;
        break;
      default:
        break;
    }
  }

  private async _checkActionPermissions() {
    const hasUpdateInfoPermission = await this.permissionsService.hasPermission(
      'infos:updateInfo'
    );

    if (!hasUpdateInfoPermission) {
      this.hiddenUploadBtn = true;
      this.hiddenDeleteBtn = true;
    }
  }

  //Update in UI
  private updateDocument(
    documentType: DOCUMENT_TYPE,
    updatedDocumentModel: UpdatedDocumentModel
  ) {
    switch (documentType) {
      case DOCUMENT_TYPE.SALARY_INFORMATION_ONE:
        this.infoVerificationForm.controls.salaryInfomationOne.setValue(
          updatedDocumentModel.file
        );
        this.salary1Src = this.domSanitizer.bypassSecurityTrustUrl(
          window.URL.createObjectURL(updatedDocumentModel.file)
        );
        break;
      case DOCUMENT_TYPE.SALARY_INFORMATION_TWO:
        this.infoVerificationForm.controls.salaryInfomationTwo.setValue(
          updatedDocumentModel.file
        );
        this.salary2Src = this.domSanitizer.bypassSecurityTrustUrl(
          window.URL.createObjectURL(updatedDocumentModel.file)
        );
        break;
      case DOCUMENT_TYPE.SALARY_INFORMATION_THREE:
        this.infoVerificationForm.controls.salaryInfomationThree.setValue(
          updatedDocumentModel.file
        );
        this.salary3Src = this.domSanitizer.bypassSecurityTrustUrl(
          window.URL.createObjectURL(updatedDocumentModel.file)
        );
        break;

      default:
        break;
    }
  }

  //Update in server
  private _updateDocument(
    documentType: DOCUMENT_TYPE,
    updatedDocumentModel: UpdatedDocumentModel
  ) {
    this.notificationService.showLoading({ showContent: true });
    this.subManager.add(
      this.customerDetailService
        .uploadFileDocument(
          documentType,
          updatedDocumentModel.file,
          this.customerInfo.id,
          null,
          true
        )
        .subscribe(
          (result) => {
            if (result?.responseCode !== RESPONSE_CODE.SUCCESS) {
              this.notifier.error(
                JSON.stringify(result?.message),
                result?.errorCode
              );
              return;
            }

            this._mapDocumentSrc(null, documentType);
            this.refreshDocumentInfo();
          },
          (error) => {
            this.notifier.error(JSON.stringify(error));
            this.notificationService.hideLoading();
          }
        )
    );
  }

  private _downloadDocumentByPath(documentPath) {
    this.notifier.info(
      this.multiLanguageService.instant('common.process_downloading')
    );
    this.subManager.add(
      this.customerDetailService
        .downloadFileDocument(this.customerInfo.id, documentPath)
        .subscribe((result) => {})
    );
  }

  //Delete in UI
  private deleteDocumentPath(documentType: DOCUMENT_TYPE) {
    let promptDialogRef = this.notificationService.openPrompt({
      title: this.multiLanguageService.instant('common.are_you_sure'),
      content: this.multiLanguageService.instant('common.cant_revert'),
      imgUrl: 'assets/img/payday-loan/warning-prompt-icon.png',
      primaryBtnText: this.multiLanguageService.instant('common.ok'),
      secondaryBtnText: this.multiLanguageService.instant('common.cancel'),
    });

    this.subManager.add(
      promptDialogRef.afterClosed().subscribe((buttonType: BUTTON_TYPE) => {
        if (buttonType === BUTTON_TYPE.PRIMARY) {
          switch (documentType) {
            case DOCUMENT_TYPE.SALARY_INFORMATION_ONE:
              this.infoVerificationForm.controls.salaryInfomationOne.reset();
              this.salary1Src = '';
              break;
            case DOCUMENT_TYPE.SALARY_INFORMATION_TWO:
              this.infoVerificationForm.controls.salaryInfomationTwo.reset();
              this.salary2Src = '';
              break;
            case DOCUMENT_TYPE.SALARY_INFORMATION_THREE:
              this.infoVerificationForm.controls.salaryInfomationThree.reset();
              this.salary3Src = '';
              break;

            default:
              break;
          }
        }
      })
    );
  }

  //Delete in server
  private _deleteDocumentPath(documentType: DOCUMENT_TYPE) {
    let promptDialogRef = this.notificationService.openPrompt({
      title: this.multiLanguageService.instant('common.are_you_sure'),
      content: this.multiLanguageService.instant('common.cant_revert'),
      imgUrl: 'assets/img/payday-loan/warning-prompt-icon.png',
      primaryBtnText: this.multiLanguageService.instant('common.ok'),
      secondaryBtnText: this.multiLanguageService.instant('common.cancel'),
    });

    let updateInfoRequest = {};
    updateInfoRequest[DOCUMENT_TYPE_MAPPING_FIELD[documentType]] = null;

    this.subManager.add(
      promptDialogRef.afterClosed().subscribe((buttonType: BUTTON_TYPE) => {
        if (buttonType === BUTTON_TYPE.PRIMARY) {
          this._updateDocumentCustomerInfo(updateInfoRequest, documentType);
        }
      })
    );
  }

  private _updateDocumentCustomerInfo(
    updateInfoRequest: Object,
    documentType: DOCUMENT_TYPE
  ) {
    this.notificationService.showLoading({ showContent: true });
    this.subManager.add(
      this.customerDetailService
        .updateCustomerInfo(this.customerInfo.id, updateInfoRequest, null, true)
        .subscribe(
          (result) => {
            if (result?.responseCode !== RESPONSE_CODE.SUCCESS) {
              this.notifier.error(
                JSON.stringify(result?.message),
                result?.errorCode
              );
              return;
            }

            this._mapDocumentSrc(null, documentType);
            this.refreshDocumentInfo();
          },
          (error) => {
            this.notifier.error(JSON.stringify(error));
            this.notificationService.hideLoading();
          }
        )
    );
  }

  private refreshDocumentInfo() {
    setTimeout(() => {
      // this.refreshContent.emit();
      this._getDocumentByPath(this.customerInfo.id, this.customerInfo);
      this.notifier.success(
        this.multiLanguageService.instant('common.update_success')
      );
      this.notificationService.hideLoading();
    }, 3000);
  }

  public onChangeDocument(
    updatedDocumentModel: UpdatedDocumentModel,
    documentPath: string,
    documentType: DOCUMENT_TYPE
  ) {
    switch (updatedDocumentModel.type) {
      case DOCUMENT_BTN_TYPE.UPLOAD:
      case DOCUMENT_BTN_TYPE.UPDATE:
        this.updateDocument(documentType, updatedDocumentModel);
        break;
      case DOCUMENT_BTN_TYPE.DOWNLOAD:
        this._downloadDocumentByPath(documentPath);
        break;
      case DOCUMENT_BTN_TYPE.DELETE:
        this.deleteDocumentPath(documentType);
        break;
      default:
        break;
    }
  }

  onSubmit() {
    if (this.infoVerificationForm.invalid) {
      return;
    }
    let promptDialogRef = this.notificationService.openPrompt({
      title: this.multiLanguageService.instant('common.confirm'),
      imgUrl: 'assets/img/payday-loan/warning-prompt-icon.png',
      content: this.multiLanguageService.instant(
        'loan_app.info_verification.are_you_sure'
      ),
      primaryBtnText: this.multiLanguageService.instant('common.ok'),
      secondaryBtnText: this.multiLanguageService.instant('common.cancel'),
    });
    this.subManager.add(
      promptDialogRef.afterClosed().subscribe((buttonType: BUTTON_TYPE) => {
        if (buttonType === BUTTON_TYPE.PRIMARY) {
          //Upload Salary Images
          const fileUpload = [];
          fileUpload.push(
            this.documentFileUpload(
              DOCUMENT_TYPE.SALARY_INFORMATION_ONE,
              this.infoVerificationForm.controls.salaryInfomationOne.value
            )
          );

          fileUpload.push(
            this.documentFileUpload(
              DOCUMENT_TYPE.SALARY_INFORMATION_TWO,
              this.infoVerificationForm.controls.salaryInfomationTwo.value
            )
          );
          fileUpload.push(
            this.documentFileUpload(
              DOCUMENT_TYPE.SALARY_INFORMATION_THREE,
              this.infoVerificationForm.controls.salaryInfomationThree.value
            )
          );

          if (fileUpload.length > 0) {
            return forkJoin(fileUpload).subscribe((results) => {
              results.forEach((result: ApiResponseObject) => {
                if (!result || result.responseCode !== 200) {
                  return this.handleResponseError(result.errorCode);
                }
                this.salaryPathArray.push(result.result['documentPath']);
              });
              this.submitVerifiedInfo();
            });
          }
          // this.subManager.add(
          //   this.infoControllerService
          //     .uploadSalaryInformationToAzure(
          //       this.infoVerificationForm.controls.salaryInfomationOne.value,
          //       this.infoVerificationForm.controls.salaryInfomationTwo.value,
          //       this.infoVerificationForm.controls.salaryInfomationThree.value
          //     )
          //     .subscribe((result) => {
          //       if (!result || result.responseCode !== 200) {
          //         console.log(result.errorCode, result.message);
          //         return this.handleResponseError(null);
          //       }
          //       this.submitVerifiedInfo();
          //     })
          // );
        }
      })
    );
  }

  documentFileUpload(documentType, file) {
    return this.fileControllerService.uploadSingleFile(
      documentType,
      file,
      this.customerInfo.id
    );
  }

  submitVerifiedInfo() {
    const employeeDataRequest: EmployeeDataRequest = {
      name: this.infoVerificationForm.controls.name.value,
      mobile: this.infoVerificationForm.controls.mobile.value,
      identityNumber: this.infoVerificationForm.controls.identityNumber.value,
      startWorkingDay: moment(
        this.infoVerificationForm.controls.startWorkingDay.value
      ).format('DD/MM/yyyy'),
      contractType: this.infoVerificationForm.controls.contractType.value,
      job: this.infoVerificationForm.controls.job.value,
      address: this.infoVerificationForm.controls.address.value,
      numberOfWorkDays:
        this.infoVerificationForm.controls.numberOfWorkDays.value,
      bank: this.infoVerificationForm.controls.bank.value,
      accountNumber: this.infoVerificationForm.controls.accountNumber.value,
      salaryDocument1: this.salaryPathArray[0],
      salaryDocument2: this.salaryPathArray[1],
      salaryDocument3: this.salaryPathArray[2],
    };
    this.paydayLoanControllerService
      .additionalEmployeeData(this.loanId, employeeDataRequest)
      .subscribe((result) => {
        if (!result || result.responseCode !== 200) {
          console.log(result.errorCode, result.message);
          return this.handleResponseError(null);
        }
        this.loanDetailDetectChangeStatus.emit();
        this.notifier.success(
          this.multiLanguageService.instant('common.update_success')
        );
      });
  }

  handleResponseError(errorCode: string) {
    return this.showError(
      'common.error',
      errorCode ? ERROR_CODE_KEY[errorCode] : 'common.something_went_wrong'
    );
  }

  showError(title: string, content: string) {
    return this.notificationService.openErrorModal({
      title: this.multiLanguageService.instant(title),
      content: this.multiLanguageService.instant(content),
      primaryBtnText: this.multiLanguageService.instant('common.confirm'),
    });
  }
}
