import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {AccordionAnchorDirective, AccordionDirective, AccordionLinkDirective} from './accordion';


@NgModule({
  declarations: [
    AccordionAnchorDirective,
    AccordionLinkDirective,
    AccordionDirective,
  ],
  imports: [
    CommonModule
  ],
  exports: [
    AccordionAnchorDirective,
    AccordionLinkDirective,
    AccordionDirective,
  ]
})
export class SharedModule {
}
