import { Component, OnDestroy, OnInit } from '@angular/core';
import * as fromStore from './../../../../core/store';
import * as fromActions from './../../../../core/store';
import { MultiLanguageService } from '../../../../share/translate/multiLanguageService';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import * as fromSelectors from '../../../../core/store/selectors';
import { NotificationService } from '../../../../core/services/notification.service';
import {
  ApiResponseVirtualAccount,
  GpayVirtualAccountControllerService,
} from '../../../../../../open-api-modules/payment-api-docs';
import changeAlias from '../../../../core/utils/no-accent-vietnamese';
import {
  ERROR_CODE,
  PL_STEP_NAVIGATION,
} from '../../../../core/common/enum/payday-loan';
import { InfoControllerService } from '../../../../../../open-api-modules/customer-api-docs';
import { GlobalConstants } from '../../../../core/common/global-constants';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { Subscription } from 'rxjs';

@Component({
  selector: 'ekyc',
  templateUrl: './ekyc.component.html',
  styleUrls: ['./ekyc.component.scss'],
})
export class EkycComponent implements OnInit, OnDestroy {
  customerInfo: any;
  customerId: string;
  customerId$: Observable<string>;

  subManager = new Subscription();

  constructor(
    private multiLanguageService: MultiLanguageService,
    private store: Store<fromStore.State>,
    private notificationService: NotificationService,
    private infoControllerService: InfoControllerService,
    private router: Router,
    private gpayVirtualAccountControllerService: GpayVirtualAccountControllerService,
    private titleService: Title
  ) {
    this.customerId$ = store.select(fromSelectors.getCustomerIdState);

    this.subManager.add(
      this.customerId$.subscribe((customerId) => {
        this.customerId = customerId;
      })
    );
  }

  ngOnInit(): void {
    this.titleService.setTitle(
      'Định danh điện tử' +
        ' - ' +
        GlobalConstants.PL_VALUE_DEFAULT.PROJECT_NAME
    );
    this.initHeaderInfo();
    this.getCustomerInfo();
  }

  ngOnDestroy(): void {
    this.subManager.unsubscribe();
  }

  initHeaderInfo() {
    this.store.dispatch(new fromActions.ResetEkycInfo());
    this.store.dispatch(new fromActions.ResetPaydayLoanInfo());
    this.store.dispatch(
      new fromActions.SetStepNavigationInfo(
        PL_STEP_NAVIGATION.ELECTRONIC_IDENTIFIERS
      )
    );
    this.store.dispatch(new fromActions.SetShowLeftBtn(true));
    this.store.dispatch(new fromActions.SetShowRightBtn(true));
  }

  redirectToConfirmInformationPage() {
    this.router.navigateByUrl('hmg/confirm-information').then((r) => {});
  }

  completeEkyc(ekycCompleteData) {
    if (
      !ekycCompleteData ||
      !ekycCompleteData.result ||
      !ekycCompleteData.result.idCardInfo
    ) {
      this.showErrorModal();
      return;
    }

    let ekycInfo = ekycCompleteData.result.idCardInfo;
    this.store.dispatch(new fromActions.SetEkycInfo(ekycInfo));

    this.getVirtualAccount(this.customerId, ekycInfo.name);

    this.notificationEkycSuccess();

    this.redirectToConfirmInformationPage();
  }

  showErrorModal(title?, content?) {
    this.notificationService.openErrorModal({
      title: title || this.multiLanguageService.instant('common.notification'),
      content:
        content ||
        this.multiLanguageService.instant('common.something_went_wrong'),
      primaryBtnText: this.multiLanguageService.instant('common.confirm'),
    });
  }

  notificationEkycSuccess() {
    this.notificationService.openErrorModal({
      title: this.multiLanguageService.instant(
        'payday_loan.ekyc.eKYC_successful'
      ),
      content: this.multiLanguageService.instant(
        'payday_loan.ekyc.eKYC_successful_content'
      ),
      primaryBtnText: this.multiLanguageService.instant('common.confirm'),
    });
  }

  createVirtualAccount(customerId, accountName) {
    this.subManager.add(
      this.gpayVirtualAccountControllerService
        .createVirtualAccount({
          customerId: customerId,
          accountName: changeAlias(accountName),
        })
        .subscribe((response: ApiResponseVirtualAccount) => {
          if (response.result && response.responseCode === 200) {
            return response.result;
          }

          this.showErrorModal();
        })
    );
  }

  getVirtualAccount(customerId, accountName) {
    this.subManager.add(
      this.gpayVirtualAccountControllerService
        .getVirtualAccount(customerId)
        .subscribe((response: ApiResponseVirtualAccount) => {
          if (response.result && response.responseCode === 200) {
            return response.result;
          }

          if (response.errorCode === ERROR_CODE.DO_NOT_EXIST_VIRTUAL_ACCOUNT) {
            return this.createVirtualAccount(customerId, accountName);
          }

          this.showErrorModal();
          return null;
        })
    );
  }

  getCustomerInfo() {
    this.subManager.add(
      this.infoControllerService
        .getInfo(this.customerId, null)
        .subscribe((response) => {
          if (
            response.responseCode !== 200 ||
            !response.result ||
            !response.result.personalData
          ) {
            this.showErrorModal();
            return null;
          }

          let customerInfoData = response.result.personalData;

          if (response.result.kalapaData) {
            if (!response.result.kalapaData.createdAt) {
              customerInfoData.frontId = null;
              customerInfoData.backId = null;
              customerInfoData.selfie = null;
              this.customerInfo = customerInfoData;
              return;
            }

            let ekycExpiredAt =
              GlobalConstants.PL_VALUE_DEFAULT.UNIX_TIMESTAMP_SAVE_EKYC_INFO +
              new Date(response.result.kalapaData.createdAt).getTime();
            if (new Date().getTime() > ekycExpiredAt) {
              customerInfoData.frontId = null;
              customerInfoData.backId = null;
              customerInfoData.selfie = null;
              this.customerInfo = customerInfoData;
              return;
            }
          }

          this.redirectToConfirmInformationPage();
        })
    );
  }
}
