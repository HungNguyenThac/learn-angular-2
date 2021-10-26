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
import { BaseBreadcrumbComponent } from './components/base/base-breadcrumb/base-breadcrumb.component';
import { BaseExpandedTableComponent } from './components/base/base-expanded-table/base-expanded-table.component';
import { BaseFilterFormComponent } from './components/base/base-filter-form/base-filter-form.component';
import { BaseManagementLayoutComponent } from './components/base/base-management-layout/base-management-layout.component';

@NgModule({
  declarations: [
    ...fromComponents.components,
    ...fromValidators.validators,
    ...fromDirectives.directives,
    ...fromPipes.pipes,
    BaseBreadcrumbComponent,
    BaseExpandedTableComponent,
    BaseFilterFormComponent,
    BaseManagementLayoutComponent,
  ],
  imports: [CommonModule, MaterialModule, TranslateModule, FormsModule],
  exports: [
    MaterialModule,
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
