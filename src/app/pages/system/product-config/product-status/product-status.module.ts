import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../../../../share/shared.module';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { ProductStatusListComponent } from './product-status-list/product-status-list.component';

export const ProductStatusRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'list',
        component: ProductStatusListComponent,
        data: { animation: true },
      },
    ],
  },
];

@NgModule({
  declarations: [ProductStatusListComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(ProductStatusRoutes),
    SharedModule,
    TranslateModule,
    FormsModule,
    PdfViewerModule,
  ],
})
export class ProductStatusModule {}
