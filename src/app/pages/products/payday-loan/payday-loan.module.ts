import { LoanCompanyInfoComponent } from './components/loan-company-info/loan-company-info.component';
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
import { LoanListComponent } from './loan-list/loan-list.component';
import { LoanDetailComponent } from './components/loan-detail/loan-detail.component';
import { LoanContractComponent } from './components/loan-contract/loan-contract.component';
import { LoanDocumentsComponent } from './components/loan-documents/loan-documents.component';
import { LoanRatingComponent } from './components/loan-rating/loan-rating.component';
import { LoanDetailInfoComponent } from './components/loan-detail-info/loan-detail-info.component';

@NgModule({
  declarations: [
    VerifyOtpFormComponent,
    EkycUploadComponent,
    ImageUploadAreaComponent,
    LoanListComponent,
    LoanDetailComponent,
    LoanContractComponent,
    LoanDocumentsComponent,
    LoanRatingComponent,
    LoanDetailInfoComponent,
    LoanCompanyInfoComponent,
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
