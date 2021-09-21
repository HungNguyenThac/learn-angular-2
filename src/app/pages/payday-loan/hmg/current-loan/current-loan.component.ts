import { Component, OnDestroy, OnInit } from '@angular/core';
import { MultiLanguageService } from '../../../../share/translate/multiLanguageService';
import {
  ERROR_CODE,
  GPAY_RESULT_STATUS,
  PAYDAY_LOAN_STATUS,
  REPAYMENT_STATUS,
} from '../../../../core/common/enum/payday-loan';
import * as moment from 'moment';
import {
  ApiResponseCustomerInfoResponse,
  CustomerInfoResponse,
  InfoControllerService,
} from '../../../../../../open-api-modules/customer-api-docs';
import {
  ApiResponsePaydayLoan,
  ApplicationControllerService,
  ContractControllerService,
  PaydayLoan,
} from '../../../../../../open-api-modules/loanapp-api-docs';
import { Params, Router } from '@angular/router';
import * as fromActions from '../../../../core/store';
import * as fromStore from '../../../../core/store';
import { Store } from '@ngrx/store';
import { NotificationService } from '../../../../core/services/notification.service';
import { Observable } from 'rxjs/Observable';
import * as fromSelectors from '../../../../core/store/selectors';
import { Subscription } from 'rxjs';
import formatSlug from 'src/app/core/utils/format-slug';
import { environment } from '../../../../../environments/environment';
import { Title } from '@angular/platform-browser';
import { GlobalConstants } from '../../../../core/common/global-constants';

@Component({
  selector: 'pl-current-loan',
  templateUrl: './current-loan.component.html',
  styleUrls: ['./current-loan.component.scss'],
})
export class CurrentLoanComponent implements OnInit, OnDestroy {
  currentLoan: PaydayLoan = {};
  userInfo: CustomerInfoResponse = {};

  customerId$: Observable<string>;
  customerId: string;

  coreToken$: Observable<string>;
  coreToken: string;

  routerParams$: Observable<Params>;
  routerParams: Params;

  subManager = new Subscription();

  currentLoanStatus: string;

  constructor(
    private multiLanguageService: MultiLanguageService,
    private router: Router,
    private store: Store<fromStore.State>,
    private notificationService: NotificationService,
    private applicationControllerService: ApplicationControllerService,
    private contractControllerService: ContractControllerService,
    private infoControllerService: InfoControllerService,
    private titleService: Title
  ) {
    this._initSubscribeState();
  }

  ngOnDestroy(): void {
    this.subManager.unsubscribe();
  }

  ngOnInit(): void {
    this.initPageTitle(this.routerParams.status);
    this.initHeaderInfo();
    this.initInfo();
  }

  private _initSubscribeState() {
    this.customerId$ = this.store.select(fromSelectors.getCustomerIdState);
    this.coreToken$ = this.store.select(fromSelectors.getCoreTokenState);
    this.routerParams$ = this.store.select(fromSelectors.getRouterParams);

    this.subManager.add(
      this.customerId$.subscribe((customerId) => {
        this.customerId = customerId;
      })
    );

    this.subManager.add(
      this.coreToken$.subscribe((coreToken) => {
        this.coreToken = coreToken;
      })
    );

    this.subManager.add(
      this.routerParams$.subscribe((routerParams) => {
        this.routerParams = routerParams;
      })
    );
  }

  initHeaderInfo() {
    this.store.dispatch(new fromActions.ResetPaydayLoanInfo());
    this.store.dispatch(new fromActions.SetShowLeftBtn(false));
    this.store.dispatch(new fromActions.SetShowRightBtn(false));
    this.store.dispatch(new fromActions.SetShowProfileBtn(true));
    this.store.dispatch(new fromActions.SetShowStepNavigation(false));
  }

  viewContract() {
    this.router.navigateByUrl('hmg/sign-contract');
  }

  finalization() {
    this.router.navigateByUrl('hmg/loan-payment');
  }

  initPageTitle(status) {
    let pageTitle = this.getPageTitle(status);
    this.titleService.setTitle(
      pageTitle + ' - ' + GlobalConstants.PL_VALUE_DEFAULT.PROJECT_NAME
    );
  }

  initInfo() {
    // if (this.isChooseAmountSuccess) {
    //   this.notificationService.showLoading();
    //   setTimeout(async () => {
    //     this.notificationService.hideLoading();
    //     // this.resetChooseAmountSuccess();
    //     await this.getActiveLoan(false, true);
    //     await this.getContractCurrentLoan(false, true);
    //   }, 5000);
    //   return;
    // }
    this.getActiveLoan();
    // this.getContractCurrentLoan();
  }

  // getContractCurrentLoan(showLoading = true) {
  //   if (!this.currentLoan.id || !this.customerId) return;
  //
  //   if (showLoading) {
  //     this.notificationService.showLoading();
  //   }
  //   this.subManager.add(
  //     this.contractControllerService
  //       .getContract(this.currentLoan.id, this.customerId)
  //       .subscribe(
  //         (response) => {
  //           this.notificationService.hideLoading();
  //           if (response.responseCode == 200) {
  //             this.contractInfo.status = response.result['status'];
  //           }
  //         },
  //         (error) => {},
  //         () => {
  //           this.notificationService.hideLoading();
  //         }
  //       )
  //   );
  // }

  getActiveLoan(showLoading = true) {
    if (showLoading) {
      this.notificationService.showLoading();
    }
    this.subManager.add(
      this.applicationControllerService
        .getActiveLoan(this.customerId, this.coreToken)
        .subscribe(
          (response: ApiResponsePaydayLoan) => {
            this.notificationService.hideLoading();
            if (response.errorCode || response.responseCode != 200) {
              return this.handleGetActiveLoanError(response);
            }
            this.currentLoan = response.result;
            this.displayPageTitle();
            this.getUserInfo();
          },
          (error) => {},
          () => {
            this.notificationService.hideLoading();
          }
        )
    );
  }

  displayPageTitle() {
    if (
      this.routerParams['status'] !==
      formatSlug(this.currentLoan.status || PAYDAY_LOAN_STATUS.UNKNOWN_STATUS)
    ) {
      this.initPageTitle(
        this.currentLoan.status || PAYDAY_LOAN_STATUS.UNKNOWN_STATUS
      );

      this.router.navigate([
        'hmg/current-loan',
        formatSlug(
          this.currentLoan.status || PAYDAY_LOAN_STATUS.UNKNOWN_STATUS
        ),
      ]);
    }
  }

  formatGetSalaryDate(value) {
    return value
      ? moment(new Date(value), 'DD/MM/YYYY HH:mm:ss')
          .add(1, 'day')
          .format('DD/MM/YYYY HH:mm:ss')
      : 'N/A';
  }

  getUserInfo() {
    this.notificationService.showLoading();
    this.subManager.add(
      this.infoControllerService.getInfo(this.customerId).subscribe(
        (response: ApiResponseCustomerInfoResponse) => {
          if (response.responseCode !== 200) {
            this.showErrorModal();
          }
          this.userInfo = response.result;
        },
        (error) => {},
        () => {
          this.notificationService.hideLoading();
        }
      )
    );
  }

  showErrorModal(title?, content?) {
    this.notificationService.openErrorModal({
      title: environment.PRODUCTION
        ? this.multiLanguageService.instant('common.notification')
        : title || this.multiLanguageService.instant('common.notification'),
      content: environment.PRODUCTION
        ? this.multiLanguageService.instant('common.something_went_wrong')
        : content ||
          this.multiLanguageService.instant('common.something_went_wrong'),
      primaryBtnText: this.multiLanguageService.instant('common.confirm'),
    });
  }

  getPageTitle(status) {
    const currentLoanStatus = this.getStatusFromSlug(status);

    if (!currentLoanStatus) {
      return this.multiLanguageService.instant(`page_title.current_loan`);
    }

    let paydayLoanStatuses = Object.values(PAYDAY_LOAN_STATUS);
    let gpayStatuses = Object.values(GPAY_RESULT_STATUS);
    let repaymentStatuses = Object.values(REPAYMENT_STATUS);

    if (paydayLoanStatuses.includes(currentLoanStatus)) {
      return this.multiLanguageService.instant(
        `payday_loan.current_loan.status.${currentLoanStatus.toLowerCase()}`
      );
    }

    if (gpayStatuses.includes(currentLoanStatus)) {
      return this.multiLanguageService.instant(
        `payday_loan.current_loan.gpay_status.${currentLoanStatus.toLowerCase()}`
      );
    }

    if (repaymentStatuses.includes(currentLoanStatus)) {
      return this.multiLanguageService.instant(
        `payday_loan.current_loan.repayment_status.${currentLoanStatus.toLowerCase()}`
      );
    }

    return this.multiLanguageService.instant(`page_title.current_loan`);
  }

  getStatusFromSlug(value) {
    return value ? value.toUpperCase()?.replace(/-/g, '_') : null;
  }

  handleGetActiveLoanError(response) {
    if (response.errorCode === ERROR_CODE.DO_NOT_ACTIVE_LOAN_ERROR) {
      this.router.navigateByUrl('companies');
      return;
    }

    this.showErrorModal(response.errorCode, response.message);
  }
}
