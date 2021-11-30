import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { MultiLanguageService } from '../../../../../share/translate/multiLanguageService';
import { NotificationService } from '../../../../../core/services/notification.service';
import { ToastrService } from 'ngx-toastr';
import { DATA_CELL_TYPE } from '../../../../../core/common/enum/operator';
import { MerchantDetailDialogComponent } from '../../../../../share/components/operators/merchant/merchant-detail-dialog/merchant-detail-dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-merchant-verify',
  templateUrl: './merchant-verify.component.html',
  styleUrls: ['./merchant-verify.component.scss'],
})
export class MerchantVerifyComponent implements OnInit {
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
    private dialog: MatDialog
  ) {}

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
      maxWidth: '800px',
      width: '90%',
      data: {
        merchantInfo: this.merchantInfo,
        tabIndex: 1,
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
      if (result === 'PRIMARY') {
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
      if (result === 'PRIMARY') {
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
      if (result === 'PRIMARY') {
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
        title: this.multiLanguageService.instant(
          'merchant.merchant_detail.contactor'
        ),
        value: this.merchantInfo.contactor,
        type: DATA_CELL_TYPE.TEXT,
        format: null,
      },
      {
        title: this.multiLanguageService.instant(
          'merchant.merchant_detail.role'
        ),
        value: this.merchantInfo.role,
        type: DATA_CELL_TYPE.TEXT,
        format: null,
      },
      {
        title: this.multiLanguageService.instant(
          'merchant.merchant_detail.phone_number'
        ),
        value: this.merchantInfo.phone,
        type: DATA_CELL_TYPE.STATUS,
        format: null,
      },
      {
        title: this.multiLanguageService.instant(
          'merchant.merchant_detail.mail_to'
        ),
        value: this.merchantInfo.mailTo,
        type: DATA_CELL_TYPE.TEXT,
        format: null,
      },
      {
        title: this.multiLanguageService.instant(
          'merchant.merchant_detail.mail_cc'
        ),
        value: this.merchantInfo.mailCc,
        type: DATA_CELL_TYPE.TEXT,
        format: null,
      },
    ];
  }

  private _initRightCompanyInfos() {
    return [
      {
        title: this.multiLanguageService.instant(
          'merchant.merchant_detail.bank'
        ),
        value: this.merchantInfo.bank,
        type: DATA_CELL_TYPE.TEXT,
        format: null,
      },
      {
        title: this.multiLanguageService.instant(
          'merchant.merchant_detail.branch'
        ),
        value: this.merchantInfo.branch,
        type: DATA_CELL_TYPE.TEXT,
        format: null,
      },
      {
        title: this.multiLanguageService.instant(
          'merchant.merchant_detail.account_number'
        ),
        value: this.merchantInfo.accountNum,
        type: DATA_CELL_TYPE.TEXT,
        format: null,
      },
      {
        title: this.multiLanguageService.instant(
          'merchant.merchant_detail.account_name'
        ),
        value: this.merchantInfo.accountName,
        type: DATA_CELL_TYPE.TEXT,
        format: null,
      },
    ];
  }
}
