import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PdModelListComponent } from './pd-model-list/pd-model-list.component';
import { PdModelElementComponent } from './components/pd-model-element/pd-model-element.component';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../../../../share/shared.module';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';
import { PdfViewerModule } from 'ng2-pdf-viewer';

export const PdModelRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'list',
        component: PdModelListComponent,
        data: { animation: true },
      },
    ],
  },
];

@NgModule({
  declarations: [PdModelListComponent, PdModelElementComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(PdModelRoutes),
    SharedModule,
    TranslateModule,
    FormsModule,
    PdfViewerModule,
  ],
})
export class PdModelModule {}
