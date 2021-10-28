import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../share/shared.module';
import { RouterModule } from '@angular/router';
import { LoanRoutes } from './loan-routing.module';
import { TranslateModule } from '@ngx-translate/core';
import { LoanListComponent } from './loan-list/loan-list.component';
import { LoanDetailComponent } from './loan-components/loan-detail/loan-detail.component';
import { LoanContractComponent } from './loan-components/loan-contract/loan-contract.component';
import { LoanDocumentsComponent } from './loan-components/loan-documents/loan-documents.component';
import { LoanRatingComponent } from './loan-components/loan-rating/loan-rating.component';
import { LoanDetailInfoComponent } from './loan-components/loan-detail-info/loan-detail-info.component';
import { LoanCompanyInfoComponent } from './loan-components/loan-company-info/loan-company-info.component';

@NgModule({
  declarations: [LoanListComponent, LoanDetailComponent, LoanContractComponent, LoanDocumentsComponent, LoanRatingComponent, LoanDetailInfoComponent, LoanCompanyInfoComponent],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(LoanRoutes),
    TranslateModule,
  ],
  exports: [LoanDetailComponent],
})
export class LoanModule {}
