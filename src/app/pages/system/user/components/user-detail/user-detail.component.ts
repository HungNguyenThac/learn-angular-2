import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MultiLanguageService } from '../../../../../share/translate/multiLanguageService';
import { Subscription } from 'rxjs';

import { DATA_CELL_TYPE } from '../../../../../core/common/enum/operator';
import { NotificationService } from '../../../../../core/services/notification.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-user-detail',
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.scss'],
})
export class UserDetailComponent implements OnInit {
  leftCompanyInfos: any[] = [];
  rightCompanyInfos: any[] = [];
  showEnableBtn: boolean = false;
  subManager = new Subscription();

  @Input() userInfo;

  constructor(
    private multiLanguageService: MultiLanguageService,
    private notificationService: NotificationService,
    private notifier: ToastrService
  ) {}

  ngOnInit(): void {
    this.leftCompanyInfos = this._initLeftCompanyInfos();
    this.rightCompanyInfos = this._initRightCompanyInfos();
  }

  ngOnDestroy(): void {}

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
        title: this.multiLanguageService.instant('system.user_detail.name'),
        value: this.userInfo.username,
        type: DATA_CELL_TYPE.TEXT,
        format: null,
      },
      {
        title: this.multiLanguageService.instant(
          'system.user_detail.login_name'
        ),
        value: this.userInfo.userAccount,
        type: DATA_CELL_TYPE.TEXT,
        format: null,
      },
      {
        title: this.multiLanguageService.instant('system.user_detail.email'),
        value: this.userInfo.email,
        type: DATA_CELL_TYPE.TEXT,
        format: null,
      },
    ];
  }

  private _initRightCompanyInfos() {
    return [
      {
        title: this.multiLanguageService.instant('system.user_detail.phone'),
        value: this.userInfo.phone,
        type: DATA_CELL_TYPE.TEXT,
        format: null,
      },
      {
        title: this.multiLanguageService.instant('system.user_detail.note'),
        value: this.userInfo.note,
        type: DATA_CELL_TYPE.TEXT,
        format: null,
      },
      {
        title: this.multiLanguageService.instant('system.user_detail.status'),
        value: this.userInfo.status,
        type: DATA_CELL_TYPE.STATUS,
        format: null,
      },
    ];
  }
}
