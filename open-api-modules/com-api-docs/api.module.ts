import { NgModule, ModuleWithProviders, SkipSelf, Optional } from '@angular/core';
import { Configuration } from './configuration';
import { HttpClient } from '@angular/common/http';

import { ContractControllerService } from './api/contractController.service';
import { FileControllerService } from './api/fileController.service';
import { InsuranceControllerService } from './api/insuranceController.service';
import { MailControllerService } from './api/mailController.service';
import { OtpControllerService } from './api/otpController.service';
import { PushNotificationControllerService } from './api/pushNotificationController.service';
import { SmsControllerService } from './api/smsController.service';
import { TemplateNotificationControllerService } from './api/templateNotificationController.service';

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
