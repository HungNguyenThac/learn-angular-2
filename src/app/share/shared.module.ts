import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {StepProgressBarComponent} from './components/progress-bar/step-progress-bar/step-progress-bar.component';
import {ConfirmationDialog} from "./components/confirmation-dialog/confirmation-dialog.component";
import {MaterialModule} from "../modules/material.modules";


@NgModule({
  declarations: [
    StepProgressBarComponent,
    ConfirmationDialog

  ],
  imports: [
    CommonModule,
    MaterialModule
  ],
  exports: [
    StepProgressBarComponent,
    ConfirmationDialog
  ]
})
export class SharedModule {
}
