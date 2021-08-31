import {CookieService} from 'ngx-cookie-service';
import {MultiLanguageService} from '../share/translate/multiLanguageService';
import {HTTP_INTERCEPTORS} from "@angular/common/http";
import * as fromInterceptors from "../share/intercepters";

export const _providers = [
  CookieService,
  MultiLanguageService,
  {
    provide: HTTP_INTERCEPTORS,
    useClass: fromInterceptors.ApiHttpInterceptor,
    multi: true
  },
  {
    provide: HTTP_INTERCEPTORS,
    useClass: fromInterceptors.TimingInterceptor,
    multi: true
  },
]

