import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from './modules/material.modules';
import { TranslateModule } from '@ngx-translate/core';
import * as fromComponents from './components';
import * as fromValidators from './validators';
import * as fromPipes from './pipes';
import * as fromDirectives from './directives';
import { FormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { NgxPermissionsModule } from 'ngx-permissions';
import { NgxViewerModule } from 'ngx-viewer';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { AddNewPdDialogComponent } from './components/operators/pd-system/add-new-pd-dialog/add-new-pd-dialog.component';
import { AddNewQuestionComponent } from './components/operators/pd-system/add-new-question/add-new-question.component';
import { MerchantImageUploadComponent } from './components/operators/merchant/merchant-image-upload/merchant-image-upload.component';
import { DialogEkycInfoDetailComponent } from './components/operators/customer/dialog-ekyc-info-detail/dialog-ekyc-info-detail.component';
import { PlCheckElementComponent } from './components/statutes/pl-check-element/pl-check-element.component';

@NgModule({
  declarations: [
    ...fromComponents.components,
    ...fromValidators.validators,
    ...fromDirectives.directives,
    ...fromPipes.pipes,
    AddNewPdDialogComponent,
    AddNewQuestionComponent,
    DialogEkycInfoDetailComponent,
    PlCheckElementComponent,
    MerchantImageUploadComponent,
  ],
  imports: [
    CommonModule,
    MaterialModule,
    TranslateModule,
    FormsModule,
    NgxPermissionsModule,
    NgxViewerModule,
    NgxMatSelectSearchModule,
  ],
  exports: [
    MaterialModule,
    NgxPermissionsModule,
    NgxViewerModule,
    NgxMatSelectSearchModule,
    ...fromComponents.components,
    ...fromValidators.validators,
    ...fromDirectives.directives,
    ...fromPipes.pipes,
    MerchantImageUploadComponent,
  ],
  providers: [
    { provide: MAT_DIALOG_DATA, useValue: {} },
    { provide: MatDialogRef, useValue: {} },
  ],
})
export class SharedModule {}
