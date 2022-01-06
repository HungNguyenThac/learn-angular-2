import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../../../../share/shared.module';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { MonexProductListComponent } from './monex-product-list/monex-product-list.component';

export const MonexProductRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'list',
        component: MonexProductListComponent,
        data: { animation: true },
      },
    ],
  },
];

@NgModule({
  declarations: [MonexProductListComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(MonexProductRoutes),
    SharedModule,
    TranslateModule,
    FormsModule,
    PdfViewerModule,
  ],
})
export class MonexProductModule {}
