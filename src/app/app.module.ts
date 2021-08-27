import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import {_providers} from './providers';
import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {HeaderComponent} from './layout/header/header.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MaterialModule} from './modules/material.modules';
import {FlexLayoutModule} from '@angular/flex-layout';
import {MainLayoutComponent} from './layout/main-layout/main-layout.component';
import {NotFoundComponent} from "./pages/errors/not-found/not-found.component";
import {ConfirmationDialog} from "./share/components/confirmation-dialog/confirmation-dialog.component";
import {ToastrModule} from 'ngx-toastr';
import {GlobalConfig} from 'ngx-toastr/toastr/toastr-config';


//open api
import * as loanappApiDocs from "../../open-api-modules/loanapp-api-docs";
import * as comApiDocs from "../../open-api-modules/com-api-docs";
import * as customerApiDocs from "../../open-api-modules/customer-api-docs";
import * as identityApiDocs from "../../open-api-modules/identity-api-docs";

import {config} from "../config";
import {HttpClient, HttpClientModule} from "@angular/common/http";
import {BlankComponent} from "./layout/blank/blank.component";

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

const customNotifierOptions: Partial<GlobalConfig> = {
  positionClass: 'toast-bottom-left',
  maxOpened: 3,                               // max toasts opened
  autoDismiss: true                           // dismiss current toast when max is reached
}

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    MainLayoutComponent,
    NotFoundComponent,
    ConfirmationDialog,
    BlankComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpClientModule,
    MaterialModule,
    FlexLayoutModule,
    ToastrModule.forRoot(customNotifierOptions),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient],
      },
    }),
    // override base path in open-api-modules
    loanappApiDocs.ApiModule.forRoot(() => {
      return new loanappApiDocs.Configuration({
        basePath: config.API_BASE_URL + config.LOANAPP_API_PATH,
      });
    }),
    comApiDocs.ApiModule.forRoot(() => {
      return new comApiDocs.Configuration({
        basePath: config.API_BASE_URL + config.COM_API_PATH,
      });
    }),
    customerApiDocs.ApiModule.forRoot(() => {
      return new customerApiDocs.Configuration({
        basePath: config.API_BASE_URL + config.CUSTOMER_API_PATH,
      });
    }),
    identityApiDocs.ApiModule.forRoot(() => {
      return new customerApiDocs.Configuration({
        basePath: config.API_BASE_URL + config.IDENTITY_API_PATH,
      });
    })
  ],
  providers: [_providers],
  bootstrap: [AppComponent]
})
export class AppModule {
}
