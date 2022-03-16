import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Subscription } from 'rxjs';
import { MultiLanguageService } from '../../../../../share/translate/multiLanguageService';
import { NotificationService } from '../../../../../core/services/notification.service';
import { ToastrService } from 'ngx-toastr';
import {
  BUTTON_TYPE,
  DATA_CELL_TYPE,
  DATA_STATUS_TYPE,
  RESPONSE_CODE,
} from '../../../../../core/common/enum/operator';
import { FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MerchantDetailDialogComponent } from '../../../../../share/components';
import {
  AdminControllerService,
  ApiResponseMerchant,
  ApiResponseString,
  UpdateMerchantRequestDto,
} from '../../../../../../../open-api-modules/merchant-api-docs';

@Component({
  selector: 'app-merchant-detail',
  templateUrl: './merchant-detail.component.html',
  styleUrls: ['./merchant-detail.component.scss'],
})
export class MerchantDetailComponent implements OnInit {
  _merchantInfo;
  leftCompanyInfos: any[] = [];
  rightCompanyInfos: any[] = [];

  @Input()
  get merchantInfo() {
    return this._merchantInfo;
  }

  set merchantInfo(value) {
    this._merchantInfo = value;
    this.leftCompanyInfos = this._initLeftMerchantInfo();
    this.rightCompanyInfos = this._initRightMerchantInfo();
  }

  @Output() updateElementInfo = new EventEmitter();
  @Output() triggerUpdateInfo = new EventEmitter<any>();
  // merchantInfoForm: FormGroup;
  showEnableBtn: boolean = false;
  subManager = new Subscription();

  constructor(
    private multiLanguageService: MultiLanguageService,
    private notificationService: NotificationService,
    private notifier: ToastrService,
    private dialog: MatDialog,
    private formBuilder: FormBuilder,
    private adminControllerService: AdminControllerService
  ) {
    // this.merchantInfoForm = this.formBuilder.group({
    //   note: [''],
    // });
  }

  get status() {
    return this.merchantInfo?.status;
  }

  ngOnInit(): void {
    this.leftCompanyInfos = this._initLeftMerchantInfo();
    this.rightCompanyInfos = this._initRightMerchantInfo();
    console.log('oooooo', this.merchantInfo);
  }

  // submitForm() {
  //   const data = this.merchantInfoForm.getRawValue();
  //   this.triggerUpdateInfo.emit({
  //     'personalData.note': data.note,
  //   });
  // }

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
        'merchant.merchant_detail.delete_merchant.title'
      ),
      content: this.multiLanguageService.instant(
        'merchant.merchant_detail.delete_merchant.content'
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
                this.updateElementInfo.emit('delete');
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

  private _bindingDialogData(data): UpdateMerchantRequestDto {
    return {
      code: data?.code || null,
      name: data?.name || null,
      address: data?.address || null,
      bdStaffId: data?.bdStaffId || null,
      sellTypes: data?.sellTypes || null,
      mobile: data?.mobile || null,
      email: data?.email || null,
      website: data?.website || null,
      identificationNumber: data?.identificationNumber || null,
      establishTime: data?.establishTime || null,
      productTypes: data?.productTypes || null,
      logo: data?.logo || null,
      description: data?.description || null,
      status: data?.status ? data?.status : 'ACTIVE',
      merchantServiceFee: data?.merchantServiceFee
        ? data?.merchantServiceFee / 100
        : null,
      customerServiceFee: data?.customerServiceFee
        ? data?.customerServiceFee / 100
        : null,
    };
  }

  private _initLeftMerchantInfo() {
    return [
      {
        title: this.multiLanguageService.instant('merchant.merchant_detail.id'),
        value: this.merchantInfo?.code,
        type: DATA_CELL_TYPE.TEXT,
        format: null,
      },
      {
        title: this.multiLanguageService.instant(
          'merchant.merchant_detail.name'
        ),
        value: this.merchantInfo?.name,
        type: DATA_CELL_TYPE.TEXT,
        format: null,
      },
      {
        title: this.multiLanguageService.instant(
          'merchant.merchant_detail.location'
        ),
        value: this.merchantInfo?.address,
        type: DATA_CELL_TYPE.TEXT,
        format: null,
      },
      {
        title: this.multiLanguageService.instant(
          'merchant.merchant_detail.merchant_fee'
        ),
        value: this.merchantInfo?.merchantServiceFee,
        type: DATA_CELL_TYPE.PERCENT,
        format: null,
      },
      {
        title: this.multiLanguageService.instant(
          'merchant.merchant_detail.customer_fee'
        ),
        value: this.merchantInfo?.customerServiceFee,
        type: DATA_CELL_TYPE.PERCENT,
        format: null,
      },
      // {
      //   title: this.multiLanguageService.instant(
      //     'merchant.merchant_detail.area'
      //   ),
      //   value: this.merchantInfo?.district,
      //   type: DATA_CELL_TYPE.TEXT,
      //   format: null,
      // },
      // {
      //   title: this.multiLanguageService.instant(
      //     'merchant.merchant_detail.commune'
      //   ),
      //   value: this.merchantInfo?.ward,
      //   type: DATA_CELL_TYPE.TEXT,
      //   format: null,
      // },
      {
        title: this.multiLanguageService.instant(
          'merchant.merchant_detail.manager'
        ),
        value: this.merchantInfo?.bdStaffId,
        type: DATA_CELL_TYPE.TEXT,
        format: null,
      },
      {
        title: this.multiLanguageService.instant(
          'merchant.merchant_detail.type'
        ),
        value: this.merchantInfo?.sellTypes,
        type: DATA_CELL_TYPE.TEXT,
        format: null,
      },
    ];
  }

  private _initRightMerchantInfo() {
    return [
      {
        title: this.multiLanguageService.instant(
          'merchant.merchant_detail.phone_number'
        ),
        value: this.merchantInfo?.mobile,
        type: DATA_CELL_TYPE.TEXT,
        format: null,
      },
      {
        title: this.multiLanguageService.instant(
          'merchant.merchant_detail.email'
        ),
        value: this.merchantInfo?.email,
        type: DATA_CELL_TYPE.TEXT,
        format: null,
      },
      {
        title: this.multiLanguageService.instant(
          'merchant.merchant_detail.website'
        ),
        value: this.merchantInfo?.website,
        type: DATA_CELL_TYPE.TEXT,
        format: null,
      },
      {
        title: this.multiLanguageService.instant(
          'merchant.merchant_detail.regis_no'
        ),
        value: this.merchantInfo?.identificationNumber,
        type: DATA_CELL_TYPE.TEXT,
        format: null,
      },
      {
        title: this.multiLanguageService.instant(
          'merchant.merchant_detail.establish'
        ),
        value: this.merchantInfo?.establishTime,
        type: DATA_CELL_TYPE.TEXT,
        format: null,
      },
      {
        title: this.multiLanguageService.instant(
          'merchant.merchant_detail.product'
        ),
        value: this.merchantInfo?.productTypes,
        type: DATA_CELL_TYPE.TEXT,
        format: null,
      },
      {
        title: this.multiLanguageService.instant(
          'merchant.merchant_detail.status'
        ),
        value: this.merchantInfo?.status,
        type: DATA_CELL_TYPE.STATUS,
        format: DATA_STATUS_TYPE.USER_STATUS,
      },
    ];
  }
}
