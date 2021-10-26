import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomerListComponent } from './customer-list/customer-list.component';
import { SharedModule } from '../../share/shared.module';
import { RouterModule } from '@angular/router';
import { CustomerRoutes } from './customer-routing.module';
import { CustomerDetailElementComponent } from './components/customer-detail-element/customer-detail-element.component';
import { TranslateModule } from '@ngx-translate/core';
import { CustomerIndividualInfoComponent } from './components/customer-individual-info/customer-individual-info.component';
import { CustomerEkycInfoComponent } from './components/customer-ekyc-info/customer-ekyc-info.component';
import { CustomerCompanyInfoComponent } from './components/customer-company-info/customer-company-info.component';
import { CustomerDocumentInfoComponent } from './components/customer-document-info/customer-document-info.component';
import { CustomerCheckInfoComponent } from './components/customer-check-info/customer-check-info.component';
import { CustomerTransactionHistoryComponent } from './components/customer-transaction-history/customer-transaction-history.component';
import { CustomerActivityHistoryComponent } from './components/customer-activity-history/customer-activity-history.component';

@NgModule({
  declarations: [
    CustomerListComponent,
    CustomerDetailElementComponent,
    CustomerIndividualInfoComponent,
    CustomerEkycInfoComponent,
    CustomerCompanyInfoComponent,
    CustomerDocumentInfoComponent,
    CustomerCheckInfoComponent,
    CustomerTransactionHistoryComponent,
    CustomerActivityHistoryComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(CustomerRoutes),
    TranslateModule,
  ],
})
export class CustomerModule {}
