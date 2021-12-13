import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PdAnswersListComponent } from './pd-answers-list/pd-answers-list.component';
import { PdAnswersElementComponent } from './components/pd-answers-element/pd-answers-element.component';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../../../../share/shared.module';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';
import { PdfViewerModule } from 'ng2-pdf-viewer';

export const PdAnswersRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'list',
        component: PdAnswersListComponent,
        data: { animation: true },
      },
    ],
  },
];

@NgModule({
  declarations: [PdAnswersListComponent, PdAnswersElementComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(PdAnswersRoutes),
    SharedModule,
    TranslateModule,
    FormsModule,
    PdfViewerModule,
  ],
})
export class PdAnswersModule {}
