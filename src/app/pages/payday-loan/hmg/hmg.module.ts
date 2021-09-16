import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {HmgRoutes} from './hmg-routing.module';
import {RouterModule} from '@angular/router';
import {SharedModule} from "../../../share/shared.module";
import { IntroduceComponent } from '../general/introduce/introduce.component';
import { CompaniesListComponent } from '../general/companies-list/companies-list.component';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { LoanDeterminationComponent } from './loan-determination/loan-determination.component';
import { PaydayLoanModule } from '../payday-loan.module';
import { TranslateModule } from '@ngx-translate/core';
import { AdditionalInformationComponent } from './additional-information/additional-information.component';
import { ConfirmInformationComponent } from './confirm-information/confirm-information.component';
import {EkycComponent} from "./ekyc/ekyc.component";
import {ContractTermsOfServiceComponent} from "./contract-terms-of-service/contract-terms-of-service.component";
import {SignContractSuccessComponent} from "./sign-contract-success/sign-contract-success.component";
import {SignContractTermsSuccessComponent} from "./sign-contract-terms-success/sign-contract-terms-success.component";
import {CurrentLoanComponent} from "./current-loan/current-loan.component";

@NgModule({
  declarations: [
    IntroduceComponent,
    CompaniesListComponent,
    LoanDeterminationComponent,
    AdditionalInformationComponent,
    ConfirmInformationComponent,
    EkycComponent,
    ContractTermsOfServiceComponent,
    SignContractSuccessComponent,
    SignContractTermsSuccessComponent,
    CurrentLoanComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(HmgRoutes),
    SharedModule,
    PdfViewerModule,
    PaydayLoanModule,
    TranslateModule,
  ]
})
export class HmgModule {
}