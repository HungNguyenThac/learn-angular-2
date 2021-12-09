import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PdGroupListComponent } from './pd-group-list/pd-group-list.component';
import { PdGroupElementComponent } from './components/pd-group-element/pd-group-element.component';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../../../../share/shared.module';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';
import { PdfViewerModule } from 'ng2-pdf-viewer';

export const PdGroupRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'list',
        component: PdGroupListComponent,
        data: { animation: true },
      },
    ],
  },
];

@NgModule({
  declarations: [PdGroupListComponent, PdGroupElementComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(PdGroupRoutes),
    SharedModule,
    TranslateModule,
    FormsModule,
    PdfViewerModule,
  ],
})
export class PdGroupModule {}
