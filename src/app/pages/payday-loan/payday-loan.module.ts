import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ContractTermsOfServiceComponent} from "./contract-terms-of-service/contract-terms-of-service.component";
import {RouterModule} from "@angular/router";
import {SharedModule} from "../../share/shared.module";
import {TranslateModule} from "@ngx-translate/core";
import {PaydayLoanRoutes} from "./payday-loan-routing.module";
import {VerifyOtpFormComponent} from "./components/verify-otp-form/verify-otp-form.component";
import {FormsModule} from "@angular/forms";
import { SignContractTermsSuccessComponent } from './sign-contract-terms-success/sign-contract-terms-success.component';
import { ElectronicSigningSuccessComponent } from './components/electronic-signing-success/electronic-signing-success.component';

@NgModule({
  declarations: [
    ContractTermsOfServiceComponent,
    VerifyOtpFormComponent,
    SignContractTermsSuccessComponent,
    ElectronicSigningSuccessComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(PaydayLoanRoutes),
    SharedModule,
    TranslateModule,
    FormsModule
  ],
  exports: [
    ContractTermsOfServiceComponent,
    SignContractTermsSuccessComponent,
    VerifyOtpFormComponent
  ]
})
export class PaydayLoanModule {
}
