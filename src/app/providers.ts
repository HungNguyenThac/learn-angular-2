import {CookieService} from 'ngx-cookie-service';
import {apiHttpInterceptorProvider} from './share/api-http-interceptor';
import {MultiLanguageService} from './share/translate/multiLanguageService';

export const _providers = [
    CookieService,
    apiHttpInterceptorProvider,
    MultiLanguageService,
]

