import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {InsuranceRoutes} from './insurance-routing.module';
import {RouterModule} from '@angular/router';
import {DetermineNeedsComponent} from "./determine-needs/determine-needs.component";
import {MaterialModule} from "../../modules/material.modules";
import { ChargeInsuranceComponent } from './charge-insurance/charge-insurance.component';


@NgModule({
  declarations: [
    DetermineNeedsComponent,
    ChargeInsuranceComponent
  ],
  imports: [
    MaterialModule,
    CommonModule,
    RouterModule.forChild(InsuranceRoutes),
  ]
})
export class InsuranceModule {
}
