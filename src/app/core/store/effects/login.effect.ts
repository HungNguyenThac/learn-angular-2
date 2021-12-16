import { RatingControllerService } from '../../../../../open-api-modules/customer-api-docs';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { map, switchMap, tap } from 'rxjs/operators';
import * as fromActions from '../actions';
import { LoginForm } from '../../../public/models';
import {
  AdminAccountControllerService,
  ApiResponseGetTokenResponse,
  ApiResponseString,
  SignOnControllerService,
} from '../../../../../open-api-modules/identity-api-docs';
import { AdminAccountControllerService as dashboardAdminAccountControllerService } from '../../../../../open-api-modules/dashboard-api-docs';
import {
  CustomerInfoResponse,
  InfoControllerService,
} from 'open-api-modules/customer-api-docs';
import {
  LoginControllerService,
  LoginInput,
} from 'open-api-modules/core-api-docs';
import { ApplicationControllerService } from '../../../../../open-api-modules/loanapp-tng-api-docs';
import { Store } from '@ngrx/store';
import * as fromStore from '../index';
import { Observable, Subscription } from 'rxjs';
import { NotificationService } from '../../services/notification.service';
import { MultiLanguageService } from '../../../share/translate/multiLanguageService';
import { ToastrService } from 'ngx-toastr';
import { RESPONSE_CODE } from '../../common/enum/operator';
import { ERROR_CODE_KEY } from '../../common/enum/payday-loan';
import { Logout } from '../actions';

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
    private AdminAccountControllerService: AdminAccountControllerService,
    private signOnControllerService: SignOnControllerService,
    private dashboardAdminAccountControllerService: dashboardAdminAccountControllerService,
    private infoService: InfoControllerService,
    private loginService: LoginControllerService,
    private applicationControllerService: ApplicationControllerService,
    private ratingControllerService: RatingControllerService,
    private notificationService: NotificationService,
    private multiLanguageService: MultiLanguageService,
    private notifier: ToastrService
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
        map((action: fromActions.Logout) => action.payload),
        switchMap(() => {
          this.notificationService.destroyAllDialog();
          return this.signOnControllerService
            .signOut()
            .pipe(
              map((response: ApiResponseString) => {
                if (response.responseCode === RESPONSE_CODE.SUCCESS) {
                  this.notifier.success(
                    this.multiLanguageService.instant('auth.logout_success')
                  );
                }
              })
            )
            .pipe(
              map(() => {
                this.store$.dispatch(new fromActions.ResetCustomerInfo());
                this.store$.dispatch(new fromActions.ResetToken());
                this.router.navigateByUrl('/auth/sign-in');
              })
            );
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

        return this.AdminAccountControllerService.getToken({
          username: username,
          secret: password,
        }).pipe(
          map((result: ApiResponseGetTokenResponse) => {
            //
            this.loginInput = login;
            if (!result || result.responseCode !== RESPONSE_CODE.SUCCESS) {
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
          this.store$.dispatch(new fromActions.GetCustomerInfo(null));
          this.router.navigateByUrl('/');
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
          this.notifier.error(
            errorCode
              ? this.multiLanguageService.instant(ERROR_CODE_KEY[errorCode])
              : this.multiLanguageService.instant('common.something_went_wrong')
          );
        })
      ),
    { dispatch: false }
  );
}
