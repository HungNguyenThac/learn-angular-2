import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
<<<<<<< HEAD
import { ApiResponseListCompanyInfo, CompanyControllerService, InfoControllerService } from 'open-api-modules/customer-api-docs';
=======
import { ToastrService } from 'ngx-toastr';
import {
  ApiResponseListCompanyInfo,
  CompanyControllerService,
  InfoControllerService,
} from 'open-api-modules/customer-api-docs';
>>>>>>> fd6de93c2e9fa438aae77f6fb44541e716c52192
import { ApplicationControllerService } from 'open-api-modules/loanapp-api-docs';
import { Observable, Subscription } from 'rxjs';
import { PAYDAY_LOAN_STATUS } from 'src/app/core/common/enum/payday-loan';
import { NotificationService } from 'src/app/core/services/notification.service';
import * as fromStore from 'src/app/core/store/index';
import formatSlug from 'src/app/core/utils/format-slug';
<<<<<<< HEAD
import { MultiLanguageService } from 'src/app/share/translate/multiLanguageService';
=======
import { Title } from '@angular/platform-browser';
>>>>>>> fd6de93c2e9fa438aae77f6fb44541e716c52192

@Component({
  selector: 'app-companies-list',
  templateUrl: './companies-list.component.html',
  styleUrls: ['./companies-list.component.scss'],
})
export class CompaniesListComponent implements OnInit {
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
    private notificationService:NotificationService,
    private multiLanguageService: MultiLanguageService,
    private applicationControllerService: ApplicationControllerService,
    private companyControllerService: CompanyControllerService,
    private titleService: Title
  ) {
    this.customerId$ = store.select(fromStore.getCustomerIdState);
    this.coreToken$ = store.select(fromStore.getCoreTokenState);
  }

  ngOnInit(): void {
    this.titleService.setTitle('Chọn công ty - Monex');
    this.subManager.add(
      this.customerId$.subscribe((id) => {
        this.customerId = id;
        console.log('customer id', id);
      })
    );

    this.subManager.add(
      this.coreToken$.subscribe((coreToken) => {
        this.coreToken = coreToken;
        console.log('coreToken', coreToken);
      })
    );

    this.infoControllerService.getInfo(this.customerId).subscribe((result) => {
      if (!result || result.responseCode !== 200) {
<<<<<<< HEAD
        return this.showError('common.error','common.something_went_wrong')
=======
        return this.notifier.error(String(result?.message));
>>>>>>> fd6de93c2e9fa438aae77f6fb44541e716c52192
      }

      if (result.result.personalData.companyId) {
        this.subManager.add(
          this.applicationControllerService
            .getActivePaydayLoan(this.customerId, this.coreToken)
            .subscribe((result) => {
              if (!result || result.responseCode !== 200) {
                return this.router.navigateByUrl('/hmg/ekyc');
              }
              return this.router.navigate([
                'hmg/current-loan',
                formatSlug(PAYDAY_LOAN_STATUS.UNKNOWN_STATUS),
              ]);
            })
        );
      }

<<<<<<< HEAD
      if(!result.result.personalData.companyId) {
        this.getListCompany()
=======
      if (!result.result.personalData.companyId) {
        this.subManager.add(
          this.companyControllerService
            .getListCompany('HMG')
            .subscribe((result: ApiResponseListCompanyInfo) => {
              if (!result || result.responseCode !== 200) {
                return this.notifier.error(String(result?.message));
              }
              console.log('list company:', result?.result);
              this.companiesList = result.result;
            })
        );
>>>>>>> fd6de93c2e9fa438aae77f6fb44541e716c52192
      }
    });
  }

  getListCompany() {
    this.subManager.add(
      this.companyControllerService.getListCompany("HMG").subscribe((result: ApiResponseListCompanyInfo)=> {
        if (!result || result.responseCode !== 200) {
          return this.showError('common.error','common.something_went_wrong')
        }
        this.companiesList = result.result
      })
    );
  }

  chooseCompany(companyId) {
<<<<<<< HEAD
    console.log("company id", companyId);
    this.infoControllerService.chooseCompany(this.customerId, {companyId}).subscribe((result)=>{
      if (!result || result.responseCode !== 200) {
        return this.showError('common.error','common.something_went_wrong')
      }
      return this.router.navigateByUrl('/hmg/ekyc')
    })
  }

  showError(title: string, content: string) {
    return this.notificationService.openErrorModal({
      title: this.multiLanguageService.instant(
        title
      ),
      content: this.multiLanguageService.instant(
        content
      ),
      primaryBtnText: this.multiLanguageService.instant('common.confirm'),
    })
  }

=======
    console.log('company id', companyId);
    this.infoControllerService
      .chooseCompany(this.customerId, { companyId })
      .subscribe((result) => {
        if (!result || result.responseCode !== 200) {
          return this.notifier.error(String(result?.message));
        }
        return this.router.navigateByUrl('/hmg/ekyc');
      });
  }
>>>>>>> fd6de93c2e9fa438aae77f6fb44541e716c52192
}
