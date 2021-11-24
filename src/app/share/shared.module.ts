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

// @ts-ignore
// @ts-ignore
@NgModule({
  declarations: [
    ...fromComponents.components,
    ...fromValidators.validators,
    ...fromDirectives.directives,
    ...fromPipes.pipes,
  ],
  imports: [CommonModule, MaterialModule, TranslateModule, FormsModule, NgxPermissionsModule],
  exports: [
    MaterialModule,
    NgxPermissionsModule,
    ...fromComponents.components,
    ...fromValidators.validators,
    ...fromDirectives.directives,
    ...fromPipes.pipes,
  ],
  providers: [
    { provide: MAT_DIALOG_DATA, useValue: {} },
    { provide: MatDialogRef, useValue: {} },
  ],
})
export class SharedModule {}
