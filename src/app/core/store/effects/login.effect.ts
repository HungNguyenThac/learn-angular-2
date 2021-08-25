import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {Location} from '@angular/common';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {of} from 'rxjs/observable/of';
import {catchError, map, switchMap, tap} from 'rxjs/operators';
import * as fromActions from '../actions';
import {Auth, LoginForm} from '../../../public/models';
import {SignOnControllerService} from "../../../../../open-api-modules/identity-api-docs";

@Injectable()
export class LoginEffects {
    constructor(
        private actions$: Actions,
        private router: Router,
        private location: Location,
        private signOnService: SignOnControllerService
    ) {
    }


    loginSingin$ = createEffect(() => this.actions$.pipe(
        ofType(fromActions.LOGIN_SIGNIN),
        map((action: fromActions.Signin) => action.payload),
        switchMap((login: LoginForm) => {
            const {password, username} = login;
          return this.signOnService
            .mobileLogin({mobile: username, password: password})
            .pipe(
              map(result => new fromActions.SigninSuccess(result.result)),
              catchError(error => of(new fromActions.SigninError(error)))
            );
        })
    ));


    loginSinginSuccess$ = createEffect(() => this.actions$.pipe(ofType(fromActions.LOGIN_SIGNIN_SUCCESS), tap(() => {
        return this.router.navigate(['sysadmin/customers/ALL']);
    })), {dispatch: false});
}
