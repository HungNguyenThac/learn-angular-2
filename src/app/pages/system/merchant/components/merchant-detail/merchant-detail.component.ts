import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Subscription } from 'rxjs';
import { MultiLanguageService } from '../../../../../share/translate/multiLanguageService';
import { NotificationService } from '../../../../../core/services/notification.service';
import { ToastrService } from 'ngx-toastr';
import {
  BUTTON_TYPE,
  DATA_CELL_TYPE,
  DATA_STATUS_TYPE,
} from '../../../../../core/common/enum/operator';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CustomerDetailUpdateDialogComponent } from '../../../../customer/components/customer-individual-info-update-dialog/customer-detail-update-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { MerchantDetailDialogComponent } from '../../../../../share/components/operators/merchant/merchant-detail-dialog/merchant-detail-dialog.component';
import { CustomerInfo } from '../../../../../../../open-api-modules/dashboard-api-docs';

@Component({
  selector: 'app-merchant-detail',
  templateUrl: './merchant-detail.component.html',
  styleUrls: ['./merchant-detail.component.scss'],
})
export class MerchantDetailComponent implements OnInit {
  @Input() merchantInfo;

  @Output() triggerUpdateInfo = new EventEmitter<any>();
  merchantInfoForm: FormGroup;
  leftCompanyInfos: any[] = [];
  rightCompanyInfos: any[] = [];
  showEnableBtn: boolean = false;
  subManager = new Subscription();

  constructor(
    private multiLanguageService: MultiLanguageService,
    private notificationService: NotificationService,
    private notifier: ToastrService,
    private dialog: MatDialog,
    private formBuilder: FormBuilder
  ) {
    this.merchantInfoForm = this.formBuilder.group({
      note: [''],
    });
  }

  ngOnInit(): void {
    this.leftCompanyInfos = this._initLeftCompanyInfos();
    this.rightCompanyInfos = this._initRightCompanyInfos();
  }

  submitForm() {
    const data = this.merchantInfoForm.getRawValue();
    this.triggerUpdateInfo.emit({
      'personalData.note': data.note,
    });
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
      },
    });
  }

  public lockPrompt() {
    const confirmLockRef = this.notificationService.openPrompt({
      imgUrl: '../../../../../assets/img/icon/group-5/Alert.svg',
      title: this.multiLanguageService.instant(
        'system.user_detail.lock_user.title'
      ),
      content: this.multiLanguageService.instant(
        'system.user_detail.lock_user.content'
      ),
      primaryBtnText: this.multiLanguageService.instant('common.lock'),
      primaryBtnClass: 'btn-error',
      secondaryBtnText: this.multiLanguageService.instant('common.skip'),
    });
    confirmLockRef.afterClosed().subscribe((result) => {
      if (result === BUTTON_TYPE.PRIMARY) {
        this.showEnableBtn = true;
      }
    });
  }

  public unlockPrompt() {
    const confirmUnlockRef = this.notificationService.openPrompt({
      imgUrl: '../../../../../assets/img/icon/group-5/unlock-dialog.svg',
      title: this.multiLanguageService.instant(
        'customer.individual_info.enable_customer.dialog_title'
      ),
      content: '',
      primaryBtnText: this.multiLanguageService.instant('common.allow'),
      primaryBtnClass: 'btn-primary',
      secondaryBtnText: this.multiLanguageService.instant('common.skip'),
    });
    confirmUnlockRef.afterClosed().subscribe((result) => {
      if (result === BUTTON_TYPE.PRIMARY) {
        this.showEnableBtn = false;
      }
    });
  }

  public deletePrompt() {
    const confirmDeleteRef = this.notificationService.openPrompt({
      imgUrl: '../../../../../assets/img/icon/group-5/delete-dialog.svg',
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
        this.notifier.success(
          this.multiLanguageService.instant(
            'system.user_detail.delete_user.toast'
          )
        );
      }
    });
  }

  private _initLeftCompanyInfos() {
    return [
      {
        title: this.multiLanguageService.instant('merchant.merchant_detail.id'),
        value: this.merchantInfo.merchantId,
        type: DATA_CELL_TYPE.TEXT,
        format: null,
      },
      {
        title: this.multiLanguageService.instant(
          'merchant.merchant_detail.name'
        ),
        value: this.merchantInfo.merchantName,
        type: DATA_CELL_TYPE.TEXT,
        format: null,
      },
      {
        title: this.multiLanguageService.instant(
          'merchant.merchant_detail.location'
        ),
        value: this.merchantInfo.merchantAddress,
        type: DATA_CELL_TYPE.TEXT,
        format: null,
      },
      {
        title: this.multiLanguageService.instant(
          'merchant.merchant_detail.area'
        ),
        value: this.merchantInfo.merchantArea,
        type: DATA_CELL_TYPE.TEXT,
        format: null,
      },
      {
        title: this.multiLanguageService.instant(
          'merchant.merchant_detail.commune'
        ),
        value: this.merchantInfo.merchantCommune,
        type: DATA_CELL_TYPE.TEXT,
        format: null,
      },
      {
        title: this.multiLanguageService.instant(
          'merchant.merchant_detail.manager'
        ),
        value: this.merchantInfo.merchantManager,
        type: DATA_CELL_TYPE.TEXT,
        format: null,
      },
      {
        title: this.multiLanguageService.instant(
          'merchant.merchant_detail.type'
        ),
        value: this.merchantInfo.merchantType,
        type: DATA_CELL_TYPE.TEXT,
        format: null,
      },
    ];
  }

  private _initRightCompanyInfos() {
    return [
      {
        title: this.multiLanguageService.instant(
          'merchant.merchant_detail.phone_number'
        ),
        value: this.merchantInfo.merchantPhone,
        type: DATA_CELL_TYPE.TEXT,
        format: null,
      },
      {
        title: this.multiLanguageService.instant(
          'merchant.merchant_detail.email'
        ),
        value: this.merchantInfo.merchantEmail,
        type: DATA_CELL_TYPE.TEXT,
        format: null,
      },
      {
        title: this.multiLanguageService.instant(
          'merchant.merchant_detail.website'
        ),
        value: this.merchantInfo.merchantWebsite,
        type: DATA_CELL_TYPE.TEXT,
        format: null,
      },
      {
        title: this.multiLanguageService.instant(
          'merchant.merchant_detail.regis_no'
        ),
        value: this.merchantInfo.merchantRegistrationNumber,
        type: DATA_CELL_TYPE.TEXT,
        format: null,
      },
      {
        title: this.multiLanguageService.instant(
          'merchant.merchant_detail.establish'
        ),
        value: this.merchantInfo.merchantEstablish,
        type: DATA_CELL_TYPE.TEXT,
        format: null,
      },
      {
        title: this.multiLanguageService.instant(
          'merchant.merchant_detail.product'
        ),
        value: this.merchantInfo.merchantProduct,
        type: DATA_CELL_TYPE.TEXT,
        format: null,
      },
      {
        title: this.multiLanguageService.instant(
          'merchant.merchant_detail.status'
        ),
        value: this.merchantInfo.merchantStatus,
        type: DATA_CELL_TYPE.STATUS,
        format: DATA_STATUS_TYPE.USER_STATUS,
      },
    ];
  }
}
