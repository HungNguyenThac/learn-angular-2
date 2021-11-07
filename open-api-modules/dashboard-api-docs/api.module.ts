import { NgModule, ModuleWithProviders, SkipSelf, Optional } from '@angular/core';
import { Configuration } from './configuration';
import { HttpClient } from '@angular/common/http';

import { ApiControllerService } from './api/apiController.service';
import { ApiResourceControllerService } from './api/apiResourceController.service';
import { ApplicationHmgControllerService } from './api/applicationHmgController.service';
import { ApplicationTngControllerService } from './api/applicationTngController.service';
import { ApprovalLetterControllerService } from './api/approvalLetterController.service';
import { BankControllerService } from './api/bankController.service';
import { CompanyControllerService } from './api/companyController.service';
import { CustomerControllerService } from './api/customerController.service';
import { EkycControllerService } from './api/ekycController.service';
import { InsuranceControllerService } from './api/insuranceController.service';
import { OpenApiControllerWebMvcService } from './api/openApiControllerWebMvc.service';
import { PaymentControllerService } from './api/paymentController.service';
import { RatingControllerService } from './api/ratingController.service';
import { Swagger2ControllerWebMvcService } from './api/swagger2ControllerWebMvc.service';
import { TngDataTransactionControllerService } from './api/tngDataTransactionController.service';

@NgModule({
  imports:      [],
  declarations: [],
  exports:      [],
  providers: []
})
export class ApiModule {
    public static forRoot(configurationFactory: () => Configuration): ModuleWithProviders<ApiModule> {
        return {
            ngModule: ApiModule,
            providers: [ { provide: Configuration, useFactory: configurationFactory } ]
        };
    }

    constructor( @Optional() @SkipSelf() parentModule: ApiModule,
                 @Optional() http: HttpClient) {
        if (parentModule) {
            throw new Error('ApiModule is already loaded. Import in your base AppModule only.');
        }
        if (!http) {
            throw new Error('You need to import the HttpClientModule in your AppModule! \n' +
            'See also https://github.com/angular/angular/issues/20575');
        }
    }
}
