import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MaterialModule} from './modules/material.modules';
import {TranslateModule} from '@ngx-translate/core';

import * as fromComponents from './components';
import * as fromValidators from './validators';
import * as fromPipes from './pipes';
import * as fromDirectives from './directives';
import {FormsModule} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import { DocumentButtonComponent } from './components/button/document-button/document-button.component';
import { UploadDocumentAreaComponent } from './components/upload-area/upload-document-area/upload-document-area.component';

@NgModule({
  declarations: [
    ...fromComponents.components,
    ...fromValidators.validators,
    ...fromDirectives.directives,
    ...fromPipes.pipes,
    DocumentButtonComponent,
    UploadDocumentAreaComponent,
  ],
  imports: [CommonModule, MaterialModule, TranslateModule, FormsModule],
  exports: [
    MaterialModule,
    ...fromComponents.components,
    ...fromValidators.validators,
    ...fromDirectives.directives,
    ...fromPipes.pipes,
    DocumentButtonComponent,
    UploadDocumentAreaComponent,
  ],
  providers: [
    { provide: MAT_DIALOG_DATA, useValue: {} },
    { provide: MatDialogRef, useValue: {} },
  ],
})
export class SharedModule {}
