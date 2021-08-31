import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
// import {AccordionAnchorDirective, AccordionDirective, AccordionLinkDirective} from './accordion';
import { FormInputComponent } from './components/form-input/form-input.component';
import { MaterialModule } from '../modules/material.modules';
import {StepProgressBarComponent} from './components/progress-bar/step-progress-bar/step-progress-bar.component';
import {ConfirmationDialog} from "./components/confirmation-dialog/confirmation-dialog.component";


@NgModule({
  declarations: [
    // AccordionAnchorDirective,
    // AccordionLinkDirective,
    // AccordionDirective,
    FormInputComponent,
    StepProgressBarComponent,
    ConfirmationDialog

  ],
  imports: [
    CommonModule,
    MaterialModule
  ],
  exports: [
    // AccordionAnchorDirective,
    // AccordionLinkDirective,
    // AccordionDirective,
    FormInputComponent,
    StepProgressBarComponent,
    ConfirmationDialog
  ]
})
export class SharedModule {
}
