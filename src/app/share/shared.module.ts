import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
// import {AccordionAnchorDirective, AccordionDirective, AccordionLinkDirective} from './accordion';
import { FormInputComponent } from './components/form-input/form-input.component';
import { MaterialModule } from '../modules/material.modules';


@NgModule({
  declarations: [
    // AccordionAnchorDirective,
    // AccordionLinkDirective,
    // AccordionDirective,
    FormInputComponent,
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
  ]
})
export class SharedModule {
}
