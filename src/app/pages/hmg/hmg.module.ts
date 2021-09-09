import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {HmgRoutes} from './hmg-routing.module';
import {RouterModule} from '@angular/router';
import {SharedModule} from "../../share/shared.module";
import { IntroduceComponent } from './introduce/introduce.component';
import { CompaniesListComponent } from './companies-list/companies-list.component';
import { UserInfoFormComponent } from './user-info-form/user-info-form.component';
import { ApprovalLetterSignComponent } from './approval-letter-sign/approval-letter-sign.component';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { AdditionalUserInfoComponent } from './additional-user-info/additional-user-info.component';
import { DetailContractSignComponent } from './detail-contract-sign/detail-contract-sign.component';

@NgModule({
  declarations: [
    IntroduceComponent,
    CompaniesListComponent,
    UserInfoFormComponent,
    ApprovalLetterSignComponent,
    AdditionalUserInfoComponent,
    DetailContractSignComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(HmgRoutes),
    SharedModule,
    PdfViewerModule,
  ]
})
export class HmgModule {
}
