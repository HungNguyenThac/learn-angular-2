import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { ToastrService } from 'ngx-toastr';
import {
  ApiResponseListCompanyInfo,
  CompanyControllerService,
  InfoControllerService,
} from 'open-api-modules/customer-api-docs';
import { ApplicationControllerService } from 'open-api-modules/loanapp-api-docs';
import { Observable, Subscription } from 'rxjs';
import { PAYDAY_LOAN_STATUS } from 'src/app/core/common/enum/payday-loan';
import * as fromStore from 'src/app/core/store/index';
import formatSlug from 'src/app/core/utils/format-slug';
import { Title } from '@angular/platform-browser';
import {GlobalConstants} from "../../../../core/common/global-constants";

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
    private notifier: ToastrService,
    private router: Router,
    private infoControllerService: InfoControllerService,
    private applicationControllerService: ApplicationControllerService,
    private companyControllerService: CompanyControllerService,
    private titleService: Title
  ) {
    this.customerId$ = store.select(fromStore.getCustomerIdState);
    this.coreToken$ = store.select(fromStore.getCoreTokenState);
  }

  ngOnInit(): void {
    this.titleService.setTitle('Chọn công ty'  + " - " + GlobalConstants.PL_VALUE_DEFAULT.PROJECT_NAME);
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
        return this.notifier.error(String(result?.message));
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
      }
    });
  }

  chooseCompany(companyId) {
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
}
