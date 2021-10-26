import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomerListComponent } from './customer-list/customer-list.component';
import { SharedModule } from '../../share/shared.module';
import { RouterModule } from '@angular/router';
import {CustomerRoutes} from "./customer-routing.module";

@NgModule({
  declarations: [CustomerListComponent],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(CustomerRoutes),
  ],
})
export class CustomerModule {}
