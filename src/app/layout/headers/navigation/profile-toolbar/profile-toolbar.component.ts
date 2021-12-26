import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { DialogUserInfoUpdateComponent } from '../../../../share/components';
import {
  BUTTON_TYPE,
  RESPONSE_CODE,
} from '../../../../core/common/enum/operator';
import {
  AdminAccountControllerService,
  ApiResponseString,
  SignOnControllerService,
  UpdateInfoAdminAccountRequest,
} from '../../../../../../open-api-modules/identity-api-docs';
import * as fromActions from '../../../../core/store';
import * as fromStore from '../../../../core/store';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { MatDialog } from '@angular/material/dialog';
import { MultiLanguageService } from '../../../../share/translate/multiLanguageService';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { AdminAccountEntity } from '../../../../../../open-api-modules/dashboard-api-docs';
import * as fromSelectors from '../../../../core/store/selectors';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'app-profile-toolbar',
  templateUrl: './profile-toolbar.component.html',
  styleUrls: ['./profile-toolbar.component.scss'],
})
export class ProfileToolbarComponent implements OnInit, OnDestroy {
  @Input() responsive: boolean;
  subManager = new Subscription();
  customerInfo$: Observable<AdminAccountEntity>;
  shortName: string = '0';
  userInfo: AdminAccountEntity;

  constructor(
    private adminAccountControllerService: AdminAccountControllerService,
    private router: Router,
    private store: Store<fromStore.State>,
    private dialog: MatDialog,
    private multiLanguageService: MultiLanguageService,
    private signOnControllerService: SignOnControllerService,
    private notifier: ToastrService
  ) {}

  ngOnInit(): void {
    this._subscribeHeaderInfo();
  }

  private _subscribeHeaderInfo() {
    this.customerInfo$ = this.store.select(fromSelectors.getCustomerInfoState);
    this.subManager.add(
      this.customerInfo$.subscribe((userInfo: AdminAccountEntity) => {
        this.userInfo = userInfo;
        if (userInfo?.fullName) {
          const names = userInfo?.fullName.split(' ');
          this.shortName = names[names.length - 1].charAt(0);
        } else {
          this.shortName = '0';
        }
      })
    );
  }

  openUpdateDialog() {
    const updateDialogRef = this.dialog.open(DialogUserInfoUpdateComponent, {
      panelClass: 'custom-info-dialog-container',
      maxWidth: '800px',
      width: '90%',
      data: this.userInfo,
    });
    this.subManager.add(
      updateDialogRef.afterClosed().subscribe((result: any) => {
        if (result && result.type === BUTTON_TYPE.PRIMARY) {
          this.updateUserInfo({
            fullName: result?.data.fullName,
            mobile: result?.data.mobile,
            note: result?.data.note,
          });
        }
      })
    );
  }

  updateUserInfo(updateUserInfoRequest: UpdateInfoAdminAccountRequest) {
    console.log('updateUserInfoRequest', updateUserInfoRequest);
    this.subManager.add(
      this.adminAccountControllerService
        .updateInfo(updateUserInfoRequest)
        .subscribe((response) => {
          if (response.responseCode !== RESPONSE_CODE.SUCCESS) {
            this.notifier.error(
              JSON.stringify(response?.message),
              response?.errorCode
            );
            return;
          }
          setTimeout(() => {
            this.store.dispatch(new fromActions.GetCustomerInfo());
            this.notifier.success(
              this.multiLanguageService.instant('common.update_success')
            );
          }, 1000);
        })
    );
  }

  onClickManageUser() {
    this.router.navigateByUrl('/system/user/list');
  }

  onClickPdGroup() {
    this.router.navigateByUrl('/system/pd-group/list');
  }

  onClickPdQuestions() {
    this.router.navigateByUrl('/system/pd-questions/list');
  }

  onClickPdAnswers() {
    this.router.navigateByUrl('/system/pd-answers/list');
  }

  onClickPdModel() {
    this.router.navigateByUrl('/system/pd-model/list');
  }

  logout() {
    this.signOut();
    this.store.dispatch(new fromActions.Logout(null));
  }

  signOut() {
    this.subManager.add(
      this.signOnControllerService
        .signOut()
        .subscribe((response: ApiResponseString) => {
          if (response.responseCode === RESPONSE_CODE.SUCCESS) {
            this.notifier.success(
              this.multiLanguageService.instant('auth.logout_success')
            );
          }
        })
    );
  }

  ngOnDestroy(): void {
    this.subManager.unsubscribe();
  }
}
