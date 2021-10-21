
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import * as dashboardApiDocs from "../../../../open-api-modules/dashboard-api-docs";
import * as loanappHmgApiDocs from "../../../../open-api-modules/loanapp-hmg-api-docs";
import * as loanappApiDocs from "../../../../open-api-modules/loanapp-api-docs";
import * as comApiDocs from "../../../../open-api-modules/com-api-docs";
import * as customerApiDocs from "../../../../open-api-modules/customer-api-docs";
import * as identityApiDocs from "../../../../open-api-modules/identity-api-docs";
import * as coreApiDocs from "../../../../open-api-modules/core-api-docs";
import * as paymentApiDocs from "../../../../open-api-modules/payment-api-docs";
import {environment} from "../../../environments/environment";

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    // override base path in open-api-modules
    dashboardApiDocs.ApiModule.forRoot(() => {
      return new dashboardApiDocs.Configuration({
        basePath: environment.API_BASE_URL + environment.DASHBOARD_API_PATH,
      });
    }),
    loanappHmgApiDocs.ApiModule.forRoot(() => {
      return new loanappHmgApiDocs.Configuration({
        basePath: environment.API_BASE_URL + environment.LOANAPP_HMG_API_PATH,
      });
    }),
    loanappApiDocs.ApiModule.forRoot(() => {
      return new loanappApiDocs.Configuration({
        basePath: environment.API_BASE_URL + environment.LOANAPP_API_PATH,
      });
    }),
    comApiDocs.ApiModule.forRoot(() => {
      return new comApiDocs.Configuration({
        basePath: environment.API_BASE_URL + environment.COM_API_PATH,
      });
    }),
    customerApiDocs.ApiModule.forRoot(() => {
      return new customerApiDocs.Configuration({
        basePath: environment.API_BASE_URL + environment.CUSTOMER_API_PATH,
      });
    }),
    identityApiDocs.ApiModule.forRoot(() => {
      return new customerApiDocs.Configuration({
        basePath: environment.API_BASE_URL + environment.IDENTITY_API_PATH,
      });
    }),
    coreApiDocs.ApiModule.forRoot(() => {
      return new loanappApiDocs.Configuration({
        basePath: environment.API_BASE_URL + environment.CORE_API_PATH,
      });
    }),
    paymentApiDocs.ApiModule.forRoot(() => {
      return new paymentApiDocs.Configuration({
        basePath: environment.API_BASE_URL + environment.PAYMENT_API_PATH,
      });
    }),
  ]
})
export class OpenApiModule { }
