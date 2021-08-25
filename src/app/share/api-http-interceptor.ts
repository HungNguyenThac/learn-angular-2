import {Injectable} from '@angular/core';
import {
    HTTP_INTERCEPTORS,
    HttpErrorResponse,
    HttpEvent,
    HttpHandler,
    HttpInterceptor,
    HttpRequest
} from '@angular/common/http';
import {Observable, of, throwError} from 'rxjs';
import {config} from '../../config';
import {Router} from '@angular/router';
import {CookieService} from 'ngx-cookie-service';
import {tap} from 'rxjs/operators';
import {Store} from "@ngrx/store";
import * as fromSelectors from './../core/store/selectors';
import * as fromActions from './../core/store';

const RESPONSE_CODE_401_CHANGE_PASSWORD_REQUIRED = 'change_password_required';

@Injectable()
export class ApiHttpInterceptor implements HttpInterceptor {
    private accessToken$: Observable<string | undefined>;
    private authorization: string | undefined = '';

    constructor(
        private router: Router,
        private cookieService: CookieService,
        private store: Store<{ accessToken: string }>
    ) {
        this.accessToken$ = store.select(fromSelectors.getTokenState);
        this.accessToken$.subscribe(token => {
            this.authorization = token;
        });
    }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        console.log("HttpRequest", request)
        const headers = {
            'Authorization': ""
        };
        if(!request.url.includes("/identity")) {
            headers['Authorization'] = `Bearer ${this.authorization}`
        }

        // clone the request
        const clone = request.clone({setHeaders: headers});
        // check domain
        if (clone.url.startsWith(config.API_BASE_URL)) {
            return next.handle(clone).pipe(tap(event => {
            }, error => {
                if (error instanceof HttpErrorResponse) return this._handleAuthError(error)
              return  null
            }));
        } else {
            return next.handle(clone);
        }
    }

    private _handleAuthError(err: HttpErrorResponse): Observable<any> | null {
        switch (err.status) {
            case 401:
                // must change password
                // if (err.error && err.error.response_code && err.error.response_code === RESPONSE_CODE_401_CHANGE_PASSWORD_REQUIRED)
                //     return of(this.router.navigate(['auth/change-password'], {state: {data: {mustChangePassword: true}}}));
                this.store.dispatch(new fromActions.Logout(null));
                return of(this.router.navigate(['auth/login']));
            default:
                throwError(err);
                break;
        }
        return null;
    }
}

export let apiHttpInterceptorProvider = {
    provide: HTTP_INTERCEPTORS,
    useClass: ApiHttpInterceptor,
    multi: true
}
