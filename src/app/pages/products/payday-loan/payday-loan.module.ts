import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../../../share/shared.module';
import { TranslateModule } from '@ngx-translate/core';
import { PaydayLoanRoutes } from './payday-loan-routing.module';
import { FormsModule } from '@angular/forms';
import { VerifyOtpFormComponent } from './components/verify-otp-form/verify-otp-form.component';
import { EkycUploadComponent } from './components/ekyc-upload/ekyc-upload.component';
import { ImageUploadAreaComponent } from './components/image-upload-area/image-upload-area.component';
import { PdfViewerModule } from 'ng2-pdf-viewer';

@NgModule({
  declarations: [
    VerifyOtpFormComponent,
    EkycUploadComponent,
    ImageUploadAreaComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(PaydayLoanRoutes),
    SharedModule,
    TranslateModule,
    FormsModule,
    PdfViewerModule,
  ],
  exports: [
    VerifyOtpFormComponent,
    EkycUploadComponent,
    ImageUploadAreaComponent,
  ],
})
export class PaydayLoanModule {}
