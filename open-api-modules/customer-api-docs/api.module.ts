import { NgModule, ModuleWithProviders, SkipSelf, Optional } from '@angular/core';
import { Configuration } from './configuration';
import { HttpClient } from '@angular/common/http';

import { ApprovalLetterControllerService } from './api/approvalLetterController.service';
import { BankControllerService } from './api/bankController.service';
import { CityControllerService } from './api/cityController.service';
import { CommuneControllerService } from './api/communeController.service';
import { CompanyControllerService } from './api/companyController.service';
import { DistrictControllerService } from './api/districtController.service';
import { InfoControllerService } from './api/infoController.service';
import { InfoV2ControllerService } from './api/infoV2Controller.service';
import { KalapaControllerService } from './api/kalapaController.service';
import { KalapaV2ControllerService } from './api/kalapaV2Controller.service';
import { NewsletterControllerService } from './api/newsletterController.service';
import { NotificationControllerService } from './api/notificationController.service';
import { RatingControllerService } from './api/ratingController.service';
import { TngControllerService } from './api/tngController.service';

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
