import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MerchantListComponent } from './merchant-list/merchant-list.component';
import { RouterModule, Routes } from '@angular/router';
import { UserListComponent } from '../user/user-list/user-list.component';
import { SharedModule } from '../../../share/shared.module';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { UserRoutes } from '../user/user.module';

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
  declarations: [MerchantListComponent],
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
