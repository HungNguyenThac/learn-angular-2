import { RatingControllerService } from '../../../../../open-api-modules/customer-api-docs';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { map, switchMap, tap } from 'rxjs/operators';
import * as fromActions from '../actions';
import { LoginForm } from '../../../public/models';
import {
  ApiResponseGetTokenResponse,
  ApiResponseLoginResponse,
  ServiceCredentialControllerService,
  SignOnControllerService,
} from '../../../../../open-api-modules/identity-api-docs';
import * as Sentry from '@sentry/angular';
import {
  ApiResponseCustomerInfoResponse,
  CustomerInfoResponse,
  InfoControllerService,
} from 'open-api-modules/customer-api-docs';
import {
  LoginControllerService,
  LoginInput,
} from 'open-api-modules/core-api-docs';
import { ApplicationControllerService } from '../../../../../open-api-modules/loanapp-api-docs';
import { Store } from '@ngrx/store';
import * as fromStore from '../index';
import { Observable, Subscription } from 'rxjs';
import { ERROR_CODE_KEY } from '../../common/enum/payday-loan';
import { NotificationService } from '../../services/notification.service';
import { MultiLanguageService } from '../../../share/translate/multiLanguageService';

@Injectable()
export class LoginEffects {
  loginInput: LoginInput;

  public customerId$: Observable<any>;
  customerId: string;

  public customerInfo$: Observable<any>;
  customerInfo: CustomerInfoResponse;

  subManager = new Subscription();

  constructor(
    private actions$: Actions,
    private store$: Store<fromStore.State>,
    private router: Router,
    private location: Location,
    private serviceCredentialControllerService: ServiceCredentialControllerService,
    private infoService: InfoControllerService,
    private loginService: LoginControllerService,
    private applicationControllerService: ApplicationControllerService,
    private ratingControllerService: RatingControllerService,
    private notificationService: NotificationService,
    private multiLanguageService: MultiLanguageService
  ) {
    this.customerId$ = store$.select(fromStore.getCustomerIdState);
    this.subManager.add(
      this.customerId$.subscribe((customer_id) => {
        this.customerId = customer_id;
      })
    );

    this.customerInfo$ = store$.select(fromStore.getCustomerInfoState);
    this.subManager.add(
      this.customerInfo$.subscribe((customerInfo) => {
        this.customerInfo = customerInfo;
      })
    );
  }

  logoutSignOut$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(fromActions.LOGIN_SIGN_OUT),
        tap(() => {
          this.notificationService.destroyAllDialog();
          this.store$.dispatch(new fromActions.ResetCustomerInfo());
          Sentry.configureScope((scope) => scope.setUser(null));
          this.router.navigateByUrl('/auth/sign-in');
        })
      ),
    { dispatch: false }
  );

  loginSingin$ = createEffect(() =>
    this.actions$.pipe(
      ofType(fromActions.LOGIN_SIGNIN),
      map((action: fromActions.Signin) => action.payload),
      switchMap((login: LoginForm) => {
        const { username, password } = login;

        return this.serviceCredentialControllerService
          .getToken({
            username: username,
            secret: password,
          })
          .pipe(
            map((result: ApiResponseGetTokenResponse) => {
              //
              this.loginInput = login;
              if (!result || result.responseCode !== 200) {
                return new fromActions.SigninError(result.errorCode);
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
        map((action: fromActions.SigninSuccess) => action.payload),
        tap(() => {
          Sentry.setUser({
            id: this.customerId
          });
          this.router.navigateByUrl("/");
        })
      ),
    { dispatch: false }
  );

  loginSigninError$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(fromActions.LOGIN_SIGNIN_ERROR),
        map((action: fromActions.SigninError) => action.payload),
        tap((errorCode: any) => {
          this.notificationService.openErrorModal({
            title: this.multiLanguageService.instant('common.notification'),
            content: errorCode
              ? this.multiLanguageService.instant(ERROR_CODE_KEY[errorCode])
              : this.multiLanguageService.instant(
                  'common.something_went_wrong'
                ),
            primaryBtnText: this.multiLanguageService.instant('common.confirm'),
          });
        })
      ),
    { dispatch: false }
  );
}
