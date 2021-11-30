import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MerchantListComponent } from './merchant-list/merchant-list.component';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../../../share/shared.module';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { MerchantElementComponent } from './components/merchant-element/merchant-element.component';
import { MerchantDetailComponent } from './components/merchant-detail/merchant-detail.component';
import { MerchantVerifyComponent } from './components/merchant-verify/merchant-verify.component';

export const MerchantRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'list',
        component: MerchantListComponent,
        data: { animation: true },
      },
    ],
  },
];

@NgModule({
  declarations: [MerchantListComponent, MerchantElementComponent, MerchantDetailComponent, MerchantVerifyComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(MerchantRoutes),
    SharedModule,
    TranslateModule,
    FormsModule,
    PdfViewerModule,
  ],
})
export class MerchantModule {}
