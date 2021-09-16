import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs/observable/of';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import * as fromActions from '../actions';
import { Auth, LoginForm } from '../../../public/models';
import { SignOnControllerService } from '../../../../../open-api-modules/identity-api-docs';
import { InfoControllerService } from 'open-api-modules/customer-api-docs';
import {
  LoginControllerService,
  LoginInput,
} from 'open-api-modules/core-api-docs';

@Injectable()
export class LoginEffects {
  loginInput: LoginInput;
  loginPayload: any;

  constructor(
    private actions$: Actions,
    private router: Router,
    private location: Location,
    private signOnService: SignOnControllerService,
    private infoService: InfoControllerService,
    private loginService: LoginControllerService
  ) {}

  loginSingin$ = createEffect(() =>
    this.actions$.pipe(
      ofType(fromActions.LOGIN_SIGNIN),
      map((action: fromActions.Signin) => action.payload),
      switchMap((login: LoginForm) => {
        const { username, password } = login;
        return this.signOnService
          .mobileLogin({
            mobile: username,
            password: password,
          })
          .pipe(
            map((result) => {
              this.loginInput = login;
              this.loginPayload = result;
              if (result.result === null) {
                return new fromActions.SigninError(result.message);
              }
              return new fromActions.SigninSuccess(result);
            })
          );
      })
    )
  );

  loginSinginSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(fromActions.LOGIN_SIGNIN_SUCCESS),
        tap(() => {
          this.infoService
            .getInfo(this.loginPayload.result.customerId)
            .subscribe((result) => {
              if (result.result.personalData.stepOne === 'DONE') {
                this.loginService.login(this.loginInput).subscribe((result) => {
                  console.log('data:', result);
                });
              }
            });
          return this.router.navigate(['hmg/introduce']);
        })
      ),
    { dispatch: false }
  );
}
