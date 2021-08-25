import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {InsuranceRoutes} from './insurance-routing.module';
import {RouterModule} from '@angular/router';
import {DetermineNeedsComponent} from "../determine-needs/determine-needs.component";
import {MaterialModule} from "../../modules/material.modules";


@NgModule({
  declarations: [
    DetermineNeedsComponent
  ],
  imports: [
    MaterialModule,
    CommonModule,
    RouterModule.forChild(InsuranceRoutes),
  ]
})
export class InsuranceModule {
}
