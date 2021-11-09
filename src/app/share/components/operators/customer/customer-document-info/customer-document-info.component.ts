import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CustomerInfo } from '../../../../../../../open-api-modules/dashboard-api-docs';
import { Subscription } from 'rxjs';
import { CustomerDetailService } from '../../../../../pages/customer/components/customer-detail-element/customer-detail.service';
import {
  DOCUMENT_TYPE,
  DOCUMENT_TYPE_MAPPING_FIELD,
} from '../../../../../core/common/enum/payday-loan';
import {
  BUTTON_TYPE,
  DOCUMENT_BTN_TYPE,
  RESPONSE_CODE,
} from '../../../../../core/common/enum/operator';
import { NotificationService } from '../../../../../core/services/notification.service';
import { MultiLanguageService } from '../../../../translate/multiLanguageService';
import { ToastrService } from 'ngx-toastr';
import { UpdatedDocumentModel } from '../../../../../public/models/external/updated-document.model';

@Component({
  selector: 'app-customer-document-info',
  templateUrl: './customer-document-info.component.html',
  styleUrls: ['./customer-document-info.component.scss'],
})
export class CustomerDocumentInfoComponent implements OnInit {
  _customerInfo: CustomerInfo;
  @Input()
  get customerInfo(): CustomerInfo {
    return this._customerInfo;
  }

  set customerInfo(value: CustomerInfo) {
    this._getDocumentByPath(this.customerId, value);
    this._customerInfo = value;
  }

  _customerId: string;
  @Input()
  get customerId(): string {
    return this._customerId;
  }

  set customerId(value: string) {
    this._customerId = value;
  }

  @Output() refreshContent = new EventEmitter<any>();

  subManager = new Subscription();
  selfieSrc: string;
  backIdSrc: string;
  backId2Src: string;
  frontIdSrc: string;
  frontId2Src: string;
  salary1Src: string;
  salary2Src: string;
  salary3Src: string;
  collateralSrc: string;
  documentTypes = DOCUMENT_TYPE;

  constructor(
    private customerDetailService: CustomerDetailService,
    private notificationService: NotificationService,
    private multiLanguageService: MultiLanguageService,
    private notifier: ToastrService
  ) {}

  ngOnInit(): void {}

  private _getDocumentByPath(customerId: string, customerInfo: CustomerInfo) {
    if (!customerId || !customerInfo) {
      return;
    }

    if (customerInfo?.frontId) {
      this._getSingleFileDocumentByPath(
        customerId,
        customerInfo?.frontId,
        DOCUMENT_TYPE.FRONT_ID_CARD
      );
    }

    if (customerInfo?.backId) {
      this._getSingleFileDocumentByPath(
        customerId,
        customerInfo?.backId,
        DOCUMENT_TYPE.BACK_ID_CARD
      );
    }

    if (customerInfo?.frontIdTwo) {
      this._getSingleFileDocumentByPath(
        customerId,
        customerInfo?.frontIdTwo,
        DOCUMENT_TYPE.FRONT_ID_CARD_TWO
      );
    }

    if (customerInfo?.backId) {
      this._getSingleFileDocumentByPath(
        customerId,
        customerInfo?.backIdTwo,
        DOCUMENT_TYPE.BACK_ID_CARD_TWO
      );
    }

    if (customerInfo?.selfie) {
      this._getSingleFileDocumentByPath(
        customerId,
        customerInfo?.selfie,
        DOCUMENT_TYPE.SELFIE
      );
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

    if (customerInfo?.collateralDocument) {
      this._getSingleFileDocumentByPath(
        customerId,
        customerInfo?.collateralDocument,
        DOCUMENT_TYPE.VEHICLE_REGISTRATION
      );
    }
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
      case DOCUMENT_TYPE.BACK_ID_CARD:
        this.backIdSrc = data;
        break;
      case DOCUMENT_TYPE.BACK_ID_CARD_TWO:
        this.backId2Src = data;
        break;
      case DOCUMENT_TYPE.FRONT_ID_CARD:
        this.frontIdSrc = data;
        break;
      case DOCUMENT_TYPE.FRONT_ID_CARD_TWO:
        this.frontId2Src = data;
        break;
      case DOCUMENT_TYPE.SELFIE:
        this.selfieSrc = data;
        break;
      case DOCUMENT_TYPE.SALARY_INFORMATION_ONE:
        this.salary1Src = data;
        break;
      case DOCUMENT_TYPE.SALARY_INFORMATION_TWO:
        this.salary2Src = data;
        break;
      case DOCUMENT_TYPE.SALARY_INFORMATION_THREE:
        this.salary3Src = data;
        break;
      case DOCUMENT_TYPE.VEHICLE_REGISTRATION:
        this.collateralSrc = data;
        break;
      default:
        break;
    }
  }

  private _updateDocument(
    documentType: DOCUMENT_TYPE,
    updatedDocumentModel: UpdatedDocumentModel
  ) {
    this.subManager.add(
      this.customerDetailService
        .uploadFileDocument(
          documentType,
          updatedDocumentModel.file,
          this.customerId
        )
        .subscribe((result) => {
          if (result?.responseCode !== RESPONSE_CODE.SUCCESS) {
            this.notifier.error(
              JSON.stringify(result?.message),
              result?.errorCode
            );
            return;
          }
          this._mapDocumentSrc(updatedDocumentModel.imgSrc, documentType);
          this.notifier.success(
            this.multiLanguageService.instant('common.update_success')
          );
          this.refreshDocumentInfo();
        })
    );
  }

  private _downloadDocumentByPath(documentPath) {
    this.notifier.info(
      this.multiLanguageService.instant('common.process_downloading')
    );
    this.subManager.add(
      this.customerDetailService
        .downloadFileDocument(this.customerId, documentPath)
        .subscribe((result) => {})
    );
  }

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
    this.subManager.add(
      this.customerDetailService
        .updateCustomerInfo(this.customerId, updateInfoRequest)
        .subscribe((result) => {
          if (result?.responseCode !== RESPONSE_CODE.SUCCESS) {
            this.notifier.error(
              JSON.stringify(result?.message),
              result?.errorCode
            );
            return;
          }

          this._mapDocumentSrc(null, documentType);
          this.notifier.success(
            this.multiLanguageService.instant('common.update_success')
          );
          this.refreshDocumentInfo();
        })
    );
  }

  private refreshDocumentInfo() {
    setTimeout(() => {
      this.refreshContent.emit();
    }, 2000);
  }

  public onChangeDocument(
    updatedDocumentModel: UpdatedDocumentModel,
    documentPath: string,
    documentType: DOCUMENT_TYPE
  ) {
    switch (updatedDocumentModel.type) {
      case DOCUMENT_BTN_TYPE.UPLOAD:
      case DOCUMENT_BTN_TYPE.UPDATE:
        this._updateDocument(documentType, updatedDocumentModel);
        break;
      case DOCUMENT_BTN_TYPE.DOWNLOAD:
        this._downloadDocumentByPath(documentPath);
        break;
      case DOCUMENT_BTN_TYPE.DELETE:
        this._deleteDocumentPath(documentType);
        break;
      default:
        break;
    }
  }
}
