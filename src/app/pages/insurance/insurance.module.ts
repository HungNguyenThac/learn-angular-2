import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {InsuranceRoutes} from './insurance-routing.module';
import {RouterModule} from '@angular/router';
import {DetermineNeedsComponent} from "./determine-needs/determine-needs.component";
import {MaterialModule} from "../../modules/material.modules";
import { InsuranceProductsChoicesComponent } from './insurance-products-choices/insurance-products-choices.component';
import { ChargeInsuranceComponent } from './charge-insurance/charge-insurance.component';
import {ChargeInsuranceFormComponent} from './components/forms/charge-insurance-form/charge-insurance-form.component';


@NgModule({
  declarations: [
    DetermineNeedsComponent,
    InsuranceProductsChoicesComponent,
    ChargeInsuranceComponent,
    ChargeInsuranceFormComponent
  ],
  imports: [
    MaterialModule,
    CommonModule,
    RouterModule.forChild(InsuranceRoutes),
  ]
})
export class InsuranceModule {
}
