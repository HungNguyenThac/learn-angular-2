import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {HmgRoutes} from './hmg-routing.module';
import {RouterModule} from '@angular/router';
import {SharedModule} from "../../share/shared.module";
import { IntroduceComponent } from './introduce/introduce.component';
import { CompaniesListComponent } from './companies-list/companies-list.component';

@NgModule({
  declarations: [
    IntroduceComponent,
    CompaniesListComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(HmgRoutes),
    SharedModule
  ]
})
export class HmgModule {
}
