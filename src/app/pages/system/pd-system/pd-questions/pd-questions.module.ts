import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PdQuestionsListComponent } from './pd-questions-list/pd-questions-list.component';
import { PdQuestionElementComponent } from './components/pd-question-element/pd-question-element.component';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../../../../share/shared.module';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';
import { PdfViewerModule } from 'ng2-pdf-viewer';

export const PdQuestionsRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'list',
        component: PdQuestionsListComponent,
        data: { animation: true },
      },
    ],
  },
];

@NgModule({
  declarations: [PdQuestionsListComponent, PdQuestionElementComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(PdQuestionsRoutes),
    SharedModule,
    TranslateModule,
    FormsModule,
    PdfViewerModule,
  ],
})
export class PdQuestionsModule {}
