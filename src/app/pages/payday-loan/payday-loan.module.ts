import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../../share/shared.module';
import { TranslateModule } from '@ngx-translate/core';
import { PaydayLoanRoutes } from './payday-loan-routing.module';
import { FormsModule } from '@angular/forms';
import { VerifyOtpFormComponent } from './components/verify-otp-form/verify-otp-form.component';
import { ElectronicSigningSuccessComponent } from './components/electronic-signing-success/electronic-signing-success.component';
import { EkycUploadComponent } from './components/ekyc-upload/ekyc-upload.component';
import { ImageUploadAreaComponent } from './components/image-upload-area/image-upload-area.component';
import { PlCurrentLoanDetailInfoComponent } from './components/pl-current-loan-detail-info/pl-current-loan-detail-info.component';
import { PlCurrentLoanUserInfoComponent } from './components/pl-current-loan-user-info/pl-current-loan-user-info.component';
import { PlInlineMessageComponent } from './components/pl-inline-message/pl-inline-message.component';
import { PlStatusLabelComponent } from './components/pl-status-label/pl-status-label.component';
import { PlIntroduceComponent } from './components/pl-introduce/pl-introduce.component';
import { PlProviderComponent } from './components/pl-provider/pl-provider.component';
import { PlVoucherListComponent } from './components/pl-voucher-list/pl-voucher-list.component';
import { ChatBoxComponent } from './components/chat-box/chat-box.component';
import { DetailLoanPaymentComponent } from './components/detail-loan-payment/detail-loan-payment.component';

@NgModule({
  declarations: [
    VerifyOtpFormComponent,
    ElectronicSigningSuccessComponent,
    EkycUploadComponent,
    ImageUploadAreaComponent,
    PlCurrentLoanDetailInfoComponent,
    PlCurrentLoanUserInfoComponent,
    PlInlineMessageComponent,
    PlStatusLabelComponent,
    PlIntroduceComponent,
    PlProviderComponent,
    PlVoucherListComponent,
    ChatBoxComponent,
    DetailLoanPaymentComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(PaydayLoanRoutes),
    SharedModule,
    TranslateModule,
    FormsModule,
  ],
  exports: [
    VerifyOtpFormComponent,
    ElectronicSigningSuccessComponent,
    EkycUploadComponent,
    ImageUploadAreaComponent,
    PlCurrentLoanDetailInfoComponent,
    PlCurrentLoanUserInfoComponent,
    PlInlineMessageComponent,
    PlStatusLabelComponent,
    PlIntroduceComponent,
    PlProviderComponent,
    PlVoucherListComponent,
    ChatBoxComponent,
    DetailLoanPaymentComponent,
  ],
})
export class PaydayLoanModule {}
