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
import { SignContractSuccessComponent } from './sign-contract-success/sign-contract-success.component';
import { EkycComponent } from './ekyc/ekyc.component';
import { EkycUploadComponent } from './components/ekyc-upload/ekyc-upload.component';
import { ImageUploadAreaComponent } from './components/image-upload-area/image-upload-area.component';
import { CurrentLoanComponent } from './current-loan/current-loan.component';
import { PlCurrentLoanDetailInfoComponent } from './components/pl-current-loan-detail-info/pl-current-loan-detail-info.component';
import { PlCurrentLoanUserInfoComponent } from './components/pl-current-loan-user-info/pl-current-loan-user-info.component';
import { PlInlineMessageComponent } from './components/pl-inline-message/pl-inline-message.component';
import { PlStatusLabelComponent } from './components/pl-status-label/pl-status-label.component';
import { PlIntroduceComponent } from './components/pl-introduce/pl-introduce.component';
import { PlProviderComponent } from './components/pl-provider/pl-provider.component';

@NgModule({
  declarations: [
    ContractTermsOfServiceComponent,
    VerifyOtpFormComponent,
    SignContractTermsSuccessComponent,
    ElectronicSigningSuccessComponent,
    SignContractSuccessComponent,
    EkycComponent,
    EkycUploadComponent,
    ImageUploadAreaComponent,
    CurrentLoanComponent,
    PlCurrentLoanDetailInfoComponent,
    PlCurrentLoanUserInfoComponent,
    PlInlineMessageComponent,
    PlStatusLabelComponent,
    PlIntroduceComponent,
    PlProviderComponent
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
    SignContractSuccessComponent,
    VerifyOtpFormComponent,
    EkycComponent,
    EkycUploadComponent,
    ImageUploadAreaComponent,
    CurrentLoanComponent,
    PlCurrentLoanDetailInfoComponent,
    PlCurrentLoanUserInfoComponent,
    PlInlineMessageComponent,
    PlStatusLabelComponent,
    PlIntroduceComponent,
    PlProviderComponent
  ]
})
export class PaydayLoanModule {
}
