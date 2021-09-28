import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import {
  ApiResponseCustomerInfoResponse,
  ApiResponseListCompanyInfo,
  CompanyControllerService,
  InfoControllerService,
} from 'open-api-modules/customer-api-docs';
import {
  ApiResponsePaydayLoan,
  ApplicationControllerService,
} from 'open-api-modules/loanapp-api-docs';
import { Observable, Subscription } from 'rxjs';
import { PAYDAY_LOAN_STATUS } from 'src/app/core/common/enum/payday-loan';
import { NotificationService } from 'src/app/core/services/notification.service';
import formatSlug from 'src/app/core/utils/format-slug';
import { MultiLanguageService } from 'src/app/share/translate/multiLanguageService';
import { Title } from '@angular/platform-browser';
import { GlobalConstants } from '../../../../core/common/global-constants';
import * as fromStore from 'src/app/core/store';
import * as fromActions from 'src/app/core/store';

@Component({
  selector: 'app-companies-list',
  templateUrl: './companies-list.component.html',
  styleUrls: ['./companies-list.component.scss'],
})
export class CompaniesListComponent implements OnInit, OnDestroy {
  companiesList = [];

  public customerId$: Observable<any>;
  customerId: string;
  public coreToken$: Observable<any>;
  coreToken: string;
  subManager = new Subscription();

  constructor(
    private store: Store<fromStore.State>,
    private router: Router,
    private infoControllerService: InfoControllerService,
    private notificationService: NotificationService,
    private multiLanguageService: MultiLanguageService,
    private applicationControllerService: ApplicationControllerService,
    private companyControllerService: CompanyControllerService,
    private titleService: Title
  ) {
    this._initSubscribeState();
  }

  ngOnInit(): void {
    this.titleService.setTitle(
      'Chọn công ty' + ' - ' + GlobalConstants.PL_VALUE_DEFAULT.PROJECT_NAME
    );
    this.initHeaderInfo();
    this.getCustomerInfo();
  }

  private _initSubscribeState() {
    this.customerId$ = this.store.select(fromStore.getCustomerIdState);
    this.coreToken$ = this.store.select(fromStore.getCoreTokenState);
    this.subManager.add(
      this.customerId$.subscribe((id) => {
        this.customerId = id;
      })
    );

    this.subManager.add(
      this.coreToken$.subscribe((coreToken) => {
        this.coreToken = coreToken;
      })
    );
  }


  initHeaderInfo() {
    this.store.dispatch(new fromActions.ResetPaydayLoanInfo());
    this.store.dispatch(new fromActions.SetNavigationTitle('Ứng lương 0% lãi'));
    this.store.dispatch(new fromActions.SetShowLeftBtn(false));
    this.store.dispatch(new fromActions.SetShowProfileBtn(true));
  }

  getCustomerInfo() {
    this.subManager.add(
      this.infoControllerService
        .getInfo(this.customerId)
        .subscribe((result: ApiResponseCustomerInfoResponse) => {
          if (!result || result.responseCode !== 200) {
            return this.showError(
              'common.error',
              'common.something_went_wrong'
            );
          }

          if (result.result.personalData.companyId) {
            this.getActiveLoan();
          }

          this.getListCompany();
        })
    );
  }

  getActiveLoan() {
    this.subManager.add(
      this.applicationControllerService
        .getActiveLoan(this.customerId, this.coreToken)
        .subscribe((result: ApiResponsePaydayLoan) => {
          if (!result || result.responseCode !== 200) {
            return;
          }
          this.store.dispatch(new fromActions.SetHasActiveLoanStatus(true));
          return this.router.navigate([
            'hmg/current-loan',
            formatSlug(
              result.result.status || PAYDAY_LOAN_STATUS.UNKNOWN_STATUS
            ),
          ]);
        })
    );
  }

  getListCompany() {
    this.subManager.add(
      this.companyControllerService
        .getListCompany('HMG')
        .subscribe((result: ApiResponseListCompanyInfo) => {
          if (!result || result.responseCode !== 200) {
            return this.showError(
              'common.error',
              'common.something_went_wrong'
            );
          }
          this.companiesList = result.result;
        })
    );
  }

  chooseCompany(companyId) {
    this.subManager.add(
      this.infoControllerService
        .chooseCompany(this.customerId, { companyId })
        .subscribe((result) => {
          if (!result || result.responseCode !== 200) {
            return this.showError(
              'common.error',
              'common.something_went_wrong'
            );
          }
          return this.router.navigateByUrl('/hmg/ekyc');
        })
    );
  }

  showError(title: string, content: string) {
    return this.notificationService.openErrorModal({
      title: this.multiLanguageService.instant(title),
      content: this.multiLanguageService.instant(content),
      primaryBtnText: this.multiLanguageService.instant('common.confirm'),
    });
  }

  ngOnDestroy(): void {
    this.subManager.unsubscribe();
  }
}
