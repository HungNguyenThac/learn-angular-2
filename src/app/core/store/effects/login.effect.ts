import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { map, switchMap, tap } from 'rxjs/operators';
import * as fromActions from '../actions';
import { LoginForm } from '../../../public/models';
import { SignOnControllerService } from '../../../../../open-api-modules/identity-api-docs';
import {
  ApiResponseCustomerInfoResponse,
  CustomerInfoResponse,
  InfoControllerService,
} from 'open-api-modules/customer-api-docs';
import {
  LoginControllerService,
  LoginInput,
} from 'open-api-modules/core-api-docs';
import {
  ApiResponseObject,
  ApplicationControllerService,
} from '../../../../../open-api-modules/loanapp-api-docs';
import { Store } from '@ngrx/store';
import * as fromStore from '../index';
import { Observable } from 'rxjs';
import formatSlug from './../../../core/utils/format-slug';
import { PAYDAY_LOAN_STATUS } from '../../common/enum/payday-loan';
import { NotificationService } from '../../services/notification.service';
import { MultiLanguageService } from '../../../share/translate/multiLanguageService';

@Injectable()
export class LoginEffects {
  loginInput: LoginInput;
  loginPayload: any;

  public coreToken$: Observable<any>;
  coreToken: string;

  public customerId$: Observable<any>;
  customerId: string;

  public customerInfo$: Observable<any>;
  customerInfo: CustomerInfoResponse;

  constructor(
    private actions$: Actions,
    private store$: Store<fromStore.State>,
    private router: Router,
    private location: Location,
    private signOnService: SignOnControllerService,
    private infoService: InfoControllerService,
    private loginService: LoginControllerService,
    private applicationControllerService: ApplicationControllerService,
    private notificationService: NotificationService,
    private multiLanguageService: MultiLanguageService
  ) {
    this.coreToken$ = store$.select(fromStore.getCoreTokenState);
    this.coreToken$.subscribe((token) => {
      this.coreToken = token;
    });

    this.customerId$ = store$.select(fromStore.getCustomerIdState);
    this.customerId$.subscribe((customer_id) => {
      this.customerId = customer_id;
    });

    this.customerInfo$ = store$.select(fromStore.getCustomerInfoState);
    this.customerInfo$.subscribe((customerInfo) => {
      this.customerInfo = customerInfo;
    });
  }

  logoutSignOut$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(fromActions.LOGIN_SIGN_OUT),
        tap(() => {
          this.notificationService.destroyAllDialog();
          this.store$.dispatch(new fromActions.ResetCustomerInfo({}));
          this.store$.dispatch(new fromActions.ResetEkycInfo({}));
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
        return this.signOnService
          .mobileLogin({
            mobile: username,
            password: password,
          })
          .pipe(
            map((result) => {
              this.loginInput = login;
              this.loginPayload = result;
              if (!result || result.responseCode !== 200) {
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
            .subscribe((result: ApiResponseCustomerInfoResponse) => {
              if (!result || result.responseCode !== 200) return;

              this.store$.dispatch(
                new fromActions.SetCustomerInfo(result.result)
              );

              if (result.result.personalData.stepOne !== 'DONE') {
                this._redirectToCurrentPage().then((r) => {});
              }

              this.store$.dispatch(new fromActions.SigninCore(this.loginInput));
            });
        })
      ),
    { dispatch: false }
  );

  loginSigninError$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(fromActions.LOGIN_SIGNIN_ERROR),
        map((action: fromActions.SigninError) => action.payload),
        tap((error: any) => {
          this.notificationService.openErrorModal({
            title: this.multiLanguageService.instant('common.notification'),
            content: error,
            primaryBtnText: this.multiLanguageService.instant('common.confirm'),
          });
        })
      ),
    { dispatch: false }
  );

  loginSinginCore$ = createEffect(() =>
    this.actions$.pipe(
      ofType(fromActions.LOGIN_SIGNIN_CORE),
      map((action: fromActions.SigninCore) => action.payload),
      switchMap((login: LoginForm) => {
        const { username, password } = login;
        return this.loginService
          .login({
            username: username,
            password: password,
          })
          .pipe(
            map((result) => {
              const coreResponse = JSON.parse(JSON.stringify(result));
              if (!coreResponse || coreResponse.code !== 200) {
                return new fromActions.SigninCoreError(coreResponse.message);
              }
              return new fromActions.SigninCoreSuccess(coreResponse);
            })
          );
      })
    )
  );

  loginSinginCoreSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(fromActions.LOGIN_SIGNIN_CORE_SUCCESS),
        tap(() => {
          this.applicationControllerService
            .getActivePaydayLoan(this.customerId, this.coreToken)
            .subscribe((result: ApiResponseObject) => {
              if (!result || result.responseCode !== 200) {
                if (this.customerInfo.personalData.companyId) {
                  return this.router.navigateByUrl('hmg/ekyc');
                }
                return this.router.navigateByUrl('companies');
              }

              //TODO wait loanapp-svc append model to get status
              return this.router.navigate([
                'hmg/current-loan',
                formatSlug(PAYDAY_LOAN_STATUS.UNKNOWN_STATUS),
              ]);
            });
        })
      ),
    { dispatch: false }
  );

  loginSinginCoreError$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(fromActions.LOGIN_SIGNIN_CORE_ERROR),
        tap(() => {
          this._redirectToCurrentPage().then((r) => {});
        })
      ),
    { dispatch: false }
  );

  private _redirectToCurrentPage() {
    if (!this.customerInfo.personalData.companyId)
      return this.router.navigate(['companies']);
    return this.router.navigate(['ekyc']);
  }
}
