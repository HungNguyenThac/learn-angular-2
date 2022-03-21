import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { MultiLanguageService } from '../../../../../share/translate/multiLanguageService';
import { NotificationService } from '../../../../../core/services/notification.service';
import { ToastrService } from 'ngx-toastr';
import {
  BUTTON_TYPE, MULTIPLE_ELEMENT_ACTION_TYPE,
  RESPONSE_CODE,
} from '../../../../../core/common/enum/operator';
import { MerchantDetailDialogComponent } from '../../../../../share/components';
import { MatDialog } from '@angular/material/dialog';
import {
  AdminControllerService,
  ApiResponseMerchant,
  ApiResponseString,
} from '../../../../../../../open-api-modules/bnpl-api-docs';
import {
  ApiResponseCustomerInfo,
  MerchantControllerService,
} from '../../../../../../../open-api-modules/dashboard-api-docs';
import CkEditorAdapters from "../../../../../core/utils/ck-editor-adapters";
import * as DecoupledEditor from '@ckeditor/ckeditor5-build-decoupled-document';

@Component({
  selector: 'app-merchant-logo',
  templateUrl: './merchant-logo.component.html',
  styleUrls: ['./merchant-logo.component.scss'],
})
export class MerchantLogoComponent implements OnInit, OnDestroy {
  _merchantId: string;
  @Input()
  get merchantId(): string {
    return this._merchantId;
  }

  set merchantId(value: string) {
    this._merchantId = value;
  }

  @Input() merchantInfo;
  @Output() triggerUpdateInfo = new EventEmitter<any>();
  @Output() updateElementInfo = new EventEmitter();
  merchantInfoForm: FormGroup;
  subManager = new Subscription();
  public Editor = DecoupledEditor;

  ckeditorConfig: any = {
    toolbar: [
      'heading',
      '|',
      'fontfamily',
      'fontsize',
      '|',
      'alignment',
      '|',
      'fontColor',
      'fontBackgroundColor',
      '|',
      'bold',
      'italic',
      'strikethrough',
      'underline',
      'subscript',
      'superscript',
      '|',
      'link',
      '|',
      'outdent',
      'indent',
      '|',
      'bulletedList',
      'numberedList',
      'todoList',
      '|',
      'sourceEditing',
      '|',
      'insertTable',
      '|',
      'mediaEmbed',
      'uploadImage',
      'blockQuote',
      'watchDog',
      'widget',
      '|',
      'undo',
      'redo',
    ],
  };

  constructor(
    private multiLanguageService: MultiLanguageService,
    private notificationService: NotificationService,
    private notifier: ToastrService,
    private dialog: MatDialog,
    private formBuilder: FormBuilder,
    private adminControllerService: AdminControllerService,
    private merchantControllerService: MerchantControllerService
  ) {
    this.buildIndividualForm();
  }

  ngOnInit(): void {
    this.initDialogData(this.merchantInfo);
  }

  buildIndividualForm() {
    this.merchantInfoForm = this.formBuilder.group({
      description: [''],
    });
  }

  initDialogData(data) {
    this.merchantInfoForm.patchValue({
      description: data?.description,
    });
  }

  public refreshContent() {
    setTimeout(() => {
      this._getMerchantInfoById(this.merchantInfo.id);
    }, 1000);
  }

  private _getMerchantInfoById(merchantId) {
    if (!merchantId) return;
    this.subManager.add(
      this.merchantControllerService
        .getMerchantById(merchantId)
        .subscribe((data: ApiResponseCustomerInfo) => {
          this.merchantInfo = data?.result;
          // this.updateElementInfo.emit(this.merchantInfo);
        })
    );
  }

  get status() {
    return this.merchantInfo?.status;
  }

  submitForm() {
    const data = this.merchantInfoForm.getRawValue();
    this.subManager.add(
      this.adminControllerService
        .v1AdminMerchantsIdPut(this.merchantId, data)
        .subscribe((data: ApiResponseMerchant) => {
          if (!data || data.responseCode !== RESPONSE_CODE.SUCCESS) {
            this.notifier.error(JSON.stringify(data?.message), data?.errorCode);
            return;
          }
          if (data.responseCode === 200) {
            setTimeout(() => {
              this.notifier.success(
                this.multiLanguageService.instant('common.update_success')
              );
            }, 500);
          }
        })
    );
  }

  openUpdateDialog() {
    const updateDialogRef = this.dialog.open(MerchantDetailDialogComponent, {
      panelClass: 'custom-info-dialog-container',
      maxWidth: '1200px',
      width: '90%',
      data: {
        merchantInfo: this.merchantInfo,
        dialogTitle: this.multiLanguageService.instant(
          'merchant.merchant_dialog.edit_merchant_title'
        ),
        tabIndex: 1,
      },
    });
    this.subManager.add(
      updateDialogRef.afterClosed().subscribe((result: any) => {
        if (result && result.type === BUTTON_TYPE.PRIMARY) {
          let updateInfoRequest = this._bindingDialogData(result.data);
          this.updateElementInfo.emit(updateInfoRequest);
        }
      })
    );
  }

  public lockPrompt() {
    const confirmLockRef = this.notificationService.openPrompt({
      imgUrl: '../../../../../assets/img/icon/group-5/svg/Alert.svg',
      title: this.multiLanguageService.instant(
        'merchant.merchant_detail.lock_merchant.title'
      ),
      content: this.multiLanguageService.instant(
        'merchant.merchant_detail.lock_merchant.content'
      ),
      primaryBtnText: this.multiLanguageService.instant('common.lock'),
      primaryBtnClass: 'btn-error',
      secondaryBtnText: this.multiLanguageService.instant('common.skip'),
    });
    confirmLockRef.afterClosed().subscribe((result) => {
      if (result === BUTTON_TYPE.PRIMARY) {
        this.subManager.add(
          this.adminControllerService
            .v1AdminMerchantsIdPut(this.merchantInfo.id, {
              status: 'LOCKED',
            })
            .subscribe((result: ApiResponseMerchant) => {
              if (!result || result.responseCode !== RESPONSE_CODE.SUCCESS) {
                return this.notifier.error(
                  JSON.stringify(result?.message),
                  result?.errorCode
                );
              }
              setTimeout(() => {
                this.updateElementInfo.emit();
                this.notifier.success(
                  this.multiLanguageService.instant('common.lock_success')
                );
              }, 3000);
            })
        );
      }
    });
  }

  public unlockPrompt() {
    const confirmUnlockRef = this.notificationService.openPrompt({
      imgUrl: '../../../../../assets/img/icon/group-5/svg/unlock-dialog.svg',
      title: this.multiLanguageService.instant(
        'merchant.merchant_detail.unlock_merchant.title'
      ),
      content: '',
      primaryBtnText: this.multiLanguageService.instant('common.allow'),
      primaryBtnClass: 'btn-primary',
      secondaryBtnText: this.multiLanguageService.instant('common.skip'),
    });
    confirmUnlockRef.afterClosed().subscribe((result) => {
      if (result === BUTTON_TYPE.PRIMARY) {
        this.subManager.add(
          this.adminControllerService
            .v1AdminMerchantsIdPut(this.merchantInfo.id, {
              status: 'ACTIVE',
            })
            .subscribe((result: ApiResponseMerchant) => {
              if (!result || result.responseCode !== RESPONSE_CODE.SUCCESS) {
                return this.notifier.error(
                  JSON.stringify(result?.message),
                  result?.errorCode
                );
              }
              setTimeout(() => {
                this.updateElementInfo.emit();
                this.notifier.success(
                  this.multiLanguageService.instant('common.unlock_success')
                );
              }, 3000);
            })
        );
      }
    });
  }

  public deletePrompt() {
    const confirmDeleteRef = this.notificationService.openPrompt({
      imgUrl: '../../../../../assets/img/icon/group-5/svg/delete-dialog.svg',
      title: this.multiLanguageService.instant(
        'system.user_detail.delete_user.title'
      ),
      content: this.multiLanguageService.instant(
        'system.user_detail.delete_user.content'
      ),
      primaryBtnText: this.multiLanguageService.instant('common.delete'),
      primaryBtnClass: 'btn-error',
      secondaryBtnText: this.multiLanguageService.instant('common.skip'),
    });
    confirmDeleteRef.afterClosed().subscribe((result) => {
      if (result === BUTTON_TYPE.PRIMARY) {
        this.subManager.add(
          this.adminControllerService
            .v1AdminMerchantsIdDelete(this.merchantInfo.id)
            .subscribe((result: ApiResponseString) => {
              if (!result || result.responseCode !== RESPONSE_CODE.SUCCESS) {
                return this.notifier.error(
                  JSON.stringify(result?.message),
                  result?.errorCode
                );
              }
              if (result.responseCode === 200) {
                this.updateElementInfo.emit(MULTIPLE_ELEMENT_ACTION_TYPE.DELETE);
                setTimeout(() => {
                  this.notifier.success(
                    this.multiLanguageService.instant(
                      'merchant.merchant_detail.delete_merchant.toast'
                    )
                  );
                }, 3000);
              }
            })
        );
      }
    });
  }

  private _bindingDialogData(data) {
    return {
      code: data?.code ? data?.code : null,
      name: data?.name ? data?.name : null,
      address: data?.address ? data?.address : null,
      ward: data?.ward ? data?.ward : null,
      district: data?.district ? data?.district : null,
      province: data?.province ? data?.province : null,
      bdStaffId: data?.bdStaffId ? data?.bdStaffId : null,
      sellTypes: data?.sellTypes ? data?.sellTypes : null,
      mobile: data?.mobile ? data?.mobile : null,
      email: data?.email ? data?.email : null,
      website: data?.website ? data?.website : null,
      identificationNumber: data?.identificationNumber
        ? data?.identificationNumber
        : null,
      establishTime: data?.establishTime ? data?.establishTime : null,
      productTypes: data?.productTypes ? data?.productTypes : null,
      merchantServiceFee: data?.merchantServiceFee
        ? parseInt(data?.merchantServiceFee)
        : 0.0,
      customerServiceFee: data?.customerServiceFee
        ? parseInt(data?.customerServiceFee)
        : 0.0,
      status: data?.status ? data?.status : 'ACTIVE',
      logo: data?.logo ? data?.logo : null,
      description: data?.description ? data?.description : null,
      descriptionImg: data?.descriptionImg ? data?.descriptionImg : null,
    };
  }

  public onReadyCkEditor(editor) {
    editor.plugins.get('FileRepository').createUploadAdapter = (loader) => {
      return new CkEditorAdapters(loader, editor.config);
    };

    editor.ui
      .getEditableElement()
      .parentElement.insertBefore(
      editor.ui.view.toolbar.element,
      editor.ui.getEditableElement()
    );
  }

  ngOnDestroy(): void {
    this.subManager.unsubscribe();
  }

}
