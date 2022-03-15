import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Merchant } from '../../../../../../../open-api-modules/dashboard-api-docs';
import { Subscription } from 'rxjs';
import {
  DOCUMENT_TYPE,
  DOCUMENT_TYPE_MAPPING_FIELD,
} from '../../../../../core/common/enum/payday-loan';
import { CustomerDetailService } from '../../../../../pages/customer/components/customer-detail-element/customer-detail.service';
import { NotificationService } from '../../../../../core/services/notification.service';
import { MultiLanguageService } from '../../../../translate/multiLanguageService';
import { ToastrService } from 'ngx-toastr';
import { NgxPermissionsService } from 'ngx-permissions';
import { UpdatedDocumentModel } from '../../../../../public/models/external/updated-document.model';
import {
  BUTTON_TYPE,
  DOCUMENT_BTN_TYPE,
  RESPONSE_CODE,
} from '../../../../../core/common/enum/operator';
import { AdminControllerService } from '../../../../../../../open-api-modules/merchant-api-docs';
import fileToBase64 from '../../../../../core/utils/file-to-base64';

@Component({
  selector: 'app-merchant-image-upload',
  templateUrl: './merchant-image-upload.component.html',
  styleUrls: ['./merchant-image-upload.component.scss'],
})
export class MerchantImageUploadComponent implements OnInit {
  _merchantInfo;
  @Input()
  get merchantInfo(): Merchant {
    return this._merchantInfo;
  }

  set merchantInfo(value: Merchant) {
    this._getDocumentByPath(value);
    this._merchantInfo = value;
  }

  _merchantId: string;
  @Input()
  get merchantId(): string {
    return this._merchantId;
  }

  set merchantId(value: string) {
    this._merchantId = value;
  }

  @Output() refreshContent = new EventEmitter<any>();

  subManager = new Subscription();
  selfieSrc: string;
  backIdSrc: string;
  logoSrc: string;
  imagesSrc: any[] = [];
  documentTypes = DOCUMENT_TYPE;
  hiddenUploadBtn: boolean = false;
  inputFiles: any;
  hiddenDeleteBtn: boolean = false;

  constructor(
    private customerDetailService: CustomerDetailService,
    private adminControllerService: AdminControllerService,
    private notificationService: NotificationService,
    private multiLanguageService: MultiLanguageService,
    private notifier: ToastrService,
    private permissionsService: NgxPermissionsService
  ) {}

  ngOnInit(): void {
    this._initSubscription();
  }

  private _initSubscription() {
    // this.subManager.add(
    //   this.permissionsService.permissions$.subscribe((permissions) => {
    //     if (permissions) {
    //       this._checkActionPermissions();
    //     }
    //   })
    // );
  }

  private _getDocumentByPath(merchantInfo) {
    if (!merchantInfo) {
      return;
    }

    if (merchantInfo?.logo) {
      this._mapDocumentSrc(merchantInfo?.logo, DOCUMENT_TYPE.LOGO);
    }
    if (merchantInfo?.descriptionImg) {
      this._mapDocumentSrc(merchantInfo?.descriptionImg, DOCUMENT_TYPE.IMAGES);
    }
  }

  private _mapDocumentSrc(data: any, documentType: DOCUMENT_TYPE) {
    switch (documentType) {
      case DOCUMENT_TYPE.LOGO:
        this.logoSrc = data;
        break;
      case DOCUMENT_TYPE.IMAGES:
        this.imagesSrc = data;
        break;
      default:
        break;
    }
  }

  private _deleteDocument(documentType: DOCUMENT_TYPE, imgSrc) {
    if (documentType === DOCUMENT_TYPE.LOGO) {
      this.sendUpdateRequest({ logo: '' }, documentType);
    } else if (documentType === DOCUMENT_TYPE.IMAGES) {
      this.sendUpdateRequest(
        {
          updateDescriptionImgRequest: {
            action: 'remove',
            files: [imgSrc],
          },
        },
        documentType
      );
    }
  }

  private _updateDocument(
    documentType: DOCUMENT_TYPE,
    imgSrc,
    documentBtnType: DOCUMENT_BTN_TYPE
  ) {
    switch (documentType) {
      case DOCUMENT_TYPE.LOGO:
        this.sendUpdateRequest(
          {
            logo: imgSrc,
          },
          documentType
        );
        break;
      case DOCUMENT_TYPE.IMAGES:
        let action = null;
        if (documentBtnType === DOCUMENT_BTN_TYPE.UPDATE) {
          action = 'remove';
        } else if (documentBtnType === DOCUMENT_BTN_TYPE.UPLOAD) {
          action = 'add';
        }

        this.sendUpdateRequest(
          {
            updateDescriptionImgRequest: {
              action: action,
              files: [imgSrc],
            },
          },
          documentType
        );
        break;
      default:
        break;
    }
  }

  private sendUpdateRequest(request, documentType) {
    this.notificationService.showLoading({ showContent: true });
    this.subManager.add(
      this.adminControllerService
        .v1AdminMerchantsIdPut(this.merchantId, request)
        .subscribe(
          (result) => {
            if (result?.responseCode !== RESPONSE_CODE.SUCCESS) {
              this.notifier.error(
                JSON.stringify(result?.message),
                result?.errorCode
              );
              return;
            }
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
        .downloadFileDocument(this.merchantId, documentPath)
        .subscribe((result) => {})
    );
  }

  private _deleteDocumentPath(documentType: DOCUMENT_TYPE, imgSrc) {
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
          this._deleteDocument(documentType, imgSrc);
        }
      })
    );
  }

  private refreshDocumentInfo() {
    setTimeout(() => {
      this.refreshContent.emit();
      this.notifier.success(
        this.multiLanguageService.instant('common.update_success')
      );
      this.notificationService.hideLoading();
    }, 3000);
  }

  public onChangeDocument(
    updatedDocumentModel: UpdatedDocumentModel,
    documentPath: string,
    documentType: DOCUMENT_TYPE,
    index?
  ) {
    switch (updatedDocumentModel.type) {
      case DOCUMENT_BTN_TYPE.UPLOAD:
      case DOCUMENT_BTN_TYPE.UPDATE:
        this._updateDocument(
          documentType,
          updatedDocumentModel.imgSrc,
          updatedDocumentModel.type
        );
        break;
      case DOCUMENT_BTN_TYPE.DOWNLOAD:
        this._downloadDocumentByPath(documentPath);
        break;
      case DOCUMENT_BTN_TYPE.DELETE:
        this._deleteDocumentPath(documentType, this.imagesSrc[index]);
        break;
      default:
        break;
    }
  }

  triggerClickInsertImageInput() {
    if (this.imagesSrc.length >= 5) {
      return;
    }
    document.getElementById('import-merchant-files').click();
  }

  triggerClickResetInput(): void {
    let resetInput: HTMLElement = document.getElementById(
      `reset-merchant-files`
    ) as HTMLElement;
    if (!resetInput) return;
    resetInput.click();
  }

  async onChangeInputFiles($event) {
    let files = $event.target.files;
    let srcFiles = await this.convertFilesToBase64(files);
    this.imagesSrc.push(...srcFiles);
    // this.triggerClickResetInput();
  }

  async convertFilesToBase64(files) {
    let result: any[] = [];
    for (const file of Array.from(files)) {
      result.push(await fileToBase64(file));
    }
    return result;
  }
}
