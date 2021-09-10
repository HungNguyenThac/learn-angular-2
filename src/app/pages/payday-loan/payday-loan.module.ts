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

@NgModule({
  declarations: [
    ContractTermsOfServiceComponent,
    VerifyOtpFormComponent,
    SignContractTermsSuccessComponent,
    ElectronicSigningSuccessComponent,
    SignContractSuccessComponent,
    EkycComponent,
    EkycUploadComponent,
    ImageUploadAreaComponent
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
    ImageUploadAreaComponent
  ]
})
export class PaydayLoanModule {
}
