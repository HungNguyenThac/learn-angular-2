import { NgModule, ModuleWithProviders, SkipSelf, Optional } from '@angular/core';
import { Configuration } from './configuration';
import { HttpClient } from '@angular/common/http';

import { ApiControllerService } from './api/apiController.service';
import { ApiResourceControllerService } from './api/apiResourceController.service';
import { ApplicationControllerService } from './api/applicationController.service';
import { ApplicationHmgControllerService } from './api/applicationHmgController.service';
import { CompanyControllerService } from './api/companyController.service';
import { CustomerControllerService } from './api/customerController.service';
import { OpenApiControllerWebMvcService } from './api/openApiControllerWebMvc.service';
import { Swagger2ControllerWebMvcService } from './api/swagger2ControllerWebMvc.service';

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
