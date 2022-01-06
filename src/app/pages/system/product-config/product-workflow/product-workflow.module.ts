import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../../../../share/shared.module';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { ProductWorkflowListComponent } from './product-workflow-list/product-workflow-list.component';

export const ProductStatusFlowRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'list',
        component: ProductWorkflowListComponent,
        data: { animation: true },
      },
    ],
  },
];

@NgModule({
  declarations: [ProductWorkflowListComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(ProductStatusFlowRoutes),
    SharedModule,
    TranslateModule,
    FormsModule,
    PdfViewerModule,
  ],
})
export class ProductWorkflowModule {}
