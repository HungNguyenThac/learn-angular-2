import {NgModule, Optional, SkipSelf} from "@angular/core";
import {CommonModule} from "@angular/common";

import {CoreStoreModule} from "./store";

import {throwIfAlreadyLoaded} from "./common/module-import-guard";

// interceptors
import {HttpClient, HttpClientModule} from "@angular/common/http";

import {SharedModule} from "../share/shared.module";
import {ToastrModule} from "ngx-toastr";
import {TranslateLoader, TranslateModule} from "@ngx-translate/core";
import {TranslateHttpLoader} from "@ngx-translate/http-loader";
import {GlobalConfig} from "ngx-toastr/toastr/toastr-config";
import {_providers} from "./providers";
import {MomentModule} from "ngx-moment";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json?cacheBuster=' + new Date().toISOString().replace(/\.|:|-/g, ''));
}

const customNotifierOptions: Partial<GlobalConfig> = {
  positionClass: 'toast-bottom-left',
  maxOpened: 3,                               // max toasts opened
  autoDismiss: true                           // dismiss current toast when max is reached
}

@NgModule({
  imports: [
    CommonModule,
    CoreStoreModule,
    SharedModule,
    HttpClientModule,
    ToastrModule.forRoot(customNotifierOptions),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient],
      },
    }),
    MomentModule,
    BrowserAnimationsModule
  ],
  providers: [_providers],
  declarations: [],
  exports: []
})
export class CoreModule {
  constructor(@Optional() @SkipSelf() parentModule: CoreModule) {
    throwIfAlreadyLoaded(parentModule, 'CoreModule');
  }
}
