import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {InsuranceRoutes} from './insurance-routing.module';
import {RouterModule} from '@angular/router';
import {DetermineNeedsComponent} from "./determine-needs/determine-needs.component";
import {MaterialModule} from "../../modules/material.modules";
import { InsuranceProductsChoicesComponent } from './insurance-products-choices/insurance-products-choices.component';


@NgModule({
  declarations: [
    DetermineNeedsComponent,
    InsuranceProductsChoicesComponent
  ],
  imports: [
    MaterialModule,
    CommonModule,
    RouterModule.forChild(InsuranceRoutes),
  ]
})
export class InsuranceModule {
}
