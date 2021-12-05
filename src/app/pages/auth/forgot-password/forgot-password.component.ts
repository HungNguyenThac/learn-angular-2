import { MultiLanguageService } from 'src/app/share/translate/multiLanguageService';
import { NotificationService } from 'src/app/core/services/notification.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import {
  CreateCustomerAccountRequest,
  ResetPasswordVerifiedAccountRequest,
  ResetVerifiedPasswordOtpRequest,
  SignOnControllerService,
} from 'open-api-modules/identity-api-docs';
import { Title } from '@angular/platform-browser';
import { GlobalConstants } from 'src/app/core/common/global-constants';
import * as fromActions from '../../../core/store';
import * as fromStore from '../../../core/store';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import {
  ERROR_CODE,
  ERROR_CODE_KEY,
} from '../../../core/common/enum/payday-loan';
import { RESPONSE_CODE } from '../../../core/common/enum/operator';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss'],
})
export class ForgotPasswordComponent implements OnInit {
  passwordForgotForm: FormGroup;
  isUsernameInputFocus: boolean = false;

  changePasswordForm: boolean = false;
  ruleAccepted: boolean = false;
  //OTP
  openOtpConfirm: boolean = false;
  otp: any = [];
  mobile: string = '';
  errorText: string = '';
  errorGetTngInfo: boolean = false;
  disabledOTP: boolean = false;
  //
  resetPasswordbyMobileOtpResult: any;

  isPasswordInputFocus: boolean = false;
  isPassVisible: boolean = false;
  isConfirmPasswordInputFocus: boolean = false;
  isConfirmPassVisible: boolean = false;

  subManager = new Subscription();

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private signOnControllerService: SignOnControllerService,
    private titleService: Title,
    private notificationService: NotificationService,
    private multiLanguageService: MultiLanguageService,
    private store: Store<fromStore.State>
  ) {
    this.passwordForgotForm = this.formBuilder.group({
      mobileNumber: ['', [Validators.required]],
      password: ['', [Validators.required]],
      confirmPassword: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {
    this.titleService.setTitle(
      'Quên mật khẩu' + ' - ' + GlobalConstants.PL_VALUE_DEFAULT.PROJECT_NAME
    );

    this.resetSession();
  }

  ngOnDestroy(): void {
    this.subManager.unsubscribe();
  }

  resetSession() {
    this.store.dispatch(new fromActions.Logout());
  }

  getOtp() {
    const createCustomerAccountRequest: CreateCustomerAccountRequest = {
      mobile: this.passwordForgotForm.controls.mobileNumber.value,
      provider: CreateCustomerAccountRequest.ProviderEnum.Cmc,
    };

    this.subManager.add(
      this.signOnControllerService
        .resetPasswordByMobileOtp(createCustomerAccountRequest)
        .subscribe((result) => {
          if (
            !result ||
            result.errorCode != null ||
            result.responseCode !== RESPONSE_CODE.SUCCESS
          ) {
            return this.handleGetOtpError(result?.errorCode);
          }

          this.openOtpConfirm = true;
          this.mobile = this.passwordForgotForm.controls.mobileNumber.value;
          this.resetPasswordbyMobileOtpResult = result.result;
        })
    );
  }

  handleGetOtpError(errorCode: string) {
    let content = this.multiLanguageService.instant(
      errorCode && ERROR_CODE_KEY[errorCode]
        ? ERROR_CODE_KEY[errorCode]
        : 'common.something_went_wrong'
    );
    if (ERROR_CODE.ACCOUNT_NOT_EXIST) {
      content = this.multiLanguageService.instant(
        'error_code.account_not_existed'
      );
    }

    return this.notificationService.openErrorModal({
      title: this.multiLanguageService.instant('common.error'),
      content: content,
      primaryBtnText: this.multiLanguageService.instant('common.confirm'),
    });
  }

  onOpenOtpConfirm() {
    if (this.passwordForgotForm.controls.mobileNumber.invalid) return;
    this.getOtp();
  }

  onSubmit() {
    const requestId = this.resetPasswordbyMobileOtpResult.requestId;
    const signature = this.resetPasswordbyMobileOtpResult.signature;

    const resetPasswordVerifiedAccountRequest: ResetPasswordVerifiedAccountRequest =
      {
        mobile: this.passwordForgotForm.controls.mobileNumber.value,
        signature: signature,
        requestId: requestId,
        otp: this.otp,
        password: this.passwordForgotForm.controls.password.value,
        password_again: this.passwordForgotForm.controls.confirmPassword.value,
      };
    this.subManager.add(
      this.signOnControllerService
        .resetPasswordByOtp(resetPasswordVerifiedAccountRequest)
        .subscribe((result) => {
          if (
            result.errorCode != null ||
            result.responseCode !== RESPONSE_CODE.SUCCESS
          ) {
            return this.handleResponseError(result.errorCode);
          }

          this.redirectToResetPasswordSuccessPage();
        })
    );
  }

  onRuleAccepted() {
    this.ruleAccepted = !this.ruleAccepted;
  }

  //OTP
  verifyOtp(otp) {
    this.errorText = null;
    const requestId = this.resetPasswordbyMobileOtpResult.requestId;
    const signature = this.resetPasswordbyMobileOtpResult.signature;
    const resetVerifiedPasswordOtpRequest: ResetVerifiedPasswordOtpRequest = {
      mobile: this.passwordForgotForm.controls.mobileNumber.value,
      signature: signature,
      requestId: requestId,
      otp: otp,
    };
    this.subManager.add(
      this.signOnControllerService
        .resetPasswordVerifiedOtp(resetVerifiedPasswordOtpRequest)
        .subscribe((result) => {
          if (
            result.errorCode != null ||
            result.responseCode !== RESPONSE_CODE.SUCCESS
          ) {
            this.errorText = this.multiLanguageService.instant(
              result.errorCode && ERROR_CODE_KEY[result.errorCode]
                ? ERROR_CODE_KEY[result.errorCode]
                : 'common.something_went_wrong'
            );
            this.otp = [];
            return this.handleResponseError(result.errorCode);
          }

          this.otp = otp;
          this.openOtpConfirm = false;
          this.changePasswordForm = true;
        })
    );
  }

  resendOtp() {
    this.errorText = null;
    this.otp = [];
    this.getOtp();
  }

  handleResponseError(errorCode: string) {
    return this.notificationService.openErrorModal({
      title: this.multiLanguageService.instant('common.error'),
      content: this.multiLanguageService.instant(
        errorCode && ERROR_CODE_KEY[errorCode]
          ? ERROR_CODE_KEY[errorCode]
          : 'common.something_went_wrong'
      ),
      primaryBtnText: this.multiLanguageService.instant('common.confirm'),
    });
  }

  redirectToResetPasswordSuccessPage() {
    this.router.navigateByUrl('/auth/reset-password-success');
  }
}
