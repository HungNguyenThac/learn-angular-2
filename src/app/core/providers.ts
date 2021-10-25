import { CookieService } from 'ngx-cookie-service';
import { MultiLanguageService } from '../share/translate/multiLanguageService';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import * as fromInterceptors from '../share/intercepters';
import { APP_INITIALIZER, Injector } from '@angular/core';
import { appInitializerFactory } from '../share/translate/appInitializerFactory';
import {MatPaginatorIntl} from "@angular/material/paginator";
import {CustomMatPaginatorIntl} from "./common/providers/mat-paginator-custom";

export const _providers = [
  CookieService,
  MultiLanguageService,
  {
    provide: MatPaginatorIntl,
    useClass: CustomMatPaginatorIntl
  },
  {
    provide: APP_INITIALIZER,
    useFactory: appInitializerFactory,
    deps: [MultiLanguageService, Injector],
    multi: true,
  },
  {
    provide: HTTP_INTERCEPTORS,
    useClass: fromInterceptors.ApiHttpInterceptor,
    multi: true,
  },
  {
    provide: HTTP_INTERCEPTORS,
    useClass: fromInterceptors.TimingInterceptor,
    multi: true,
  },
  {
    provide: HTTP_INTERCEPTORS,
    useClass: fromInterceptors.LoadingInterceptor,
    multi: true,
  },
];
