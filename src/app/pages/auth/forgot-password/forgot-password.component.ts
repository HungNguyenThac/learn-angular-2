import { MultiLanguageService } from 'src/app/share/translate/multiLanguageService';
import { NotificationService } from 'src/app/core/services/notification.service';
import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ApiResponseObject } from 'open-api-modules/com-api-docs';
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
      confirmPassword: [
        '',
        [Validators.required],
      ],
    });
  }

  ngOnInit(): void {
    this.titleService.setTitle(
      'Quên mật khẩu' + ' - ' + GlobalConstants.PL_VALUE_DEFAULT.PROJECT_NAME
    );

    this.initHeaderInfo();
    this.resetSession();
  }

  ngOnDestroy(): void {
    this.subManager.unsubscribe();
  }

  initHeaderInfo() {
    this.store.dispatch(new fromActions.ResetPaydayLoanInfo());
    this.store.dispatch(new fromActions.SetNavigationTitle('Quên mật khẩu'));
    this.store.dispatch(new fromActions.SetShowLeftBtn(true));
    this.store.dispatch(new fromActions.SetShowRightBtn(false));
  }

  resetSession() {
    this.store.dispatch(new fromActions.Logout());
  }

  getOtp() {
    const createCustomerAccountRequest: CreateCustomerAccountRequest = {
      mobile: this.passwordForgotForm.controls.mobileNumber.value,
      provider: 'cmc',
    };

    this.subManager.add(
      this.signOnControllerService
        .resetPasswordbyMobileOtp(createCustomerAccountRequest)
        .subscribe((result) => {
          if (result.errorCode != null) {
            const message = this.multiLanguageService.instant(
              'payday_loan.error_code.' + result.errorCode.toLowerCase()
            );
            return this.showError('common.error', message);
          }

          this.resetPasswordbyMobileOtpResult = result.result;
        })
    );
  }

  onOpenOtpConfirm() {
    if (!this.passwordForgotForm.controls.mobileNumber.valid) return;
    this.openOtpConfirm = true;
    console.log('open otp', this.passwordForgotForm.getRawValue());
    this.getOtp();
    this.mobile = this.passwordForgotForm.controls.mobileNumber.value;
  }

  onSubmit() {
    console.log(this.passwordForgotForm.getRawValue());
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
      .resetPasswordbyOtp(resetPasswordVerifiedAccountRequest)
      .subscribe((result) => {
        if (result.errorCode != null) {
          const message = this.multiLanguageService.instant(
            'payday_loan.error_code.' + result.errorCode.toLowerCase()
          );
          return this.showError('common.error', message);
        }

        console.log('reset password Verified success');
        this.redirectToResetPasswordSuccessPage();
      }));
  }

  onRuleAccepted() {
    this.ruleAccepted = !this.ruleAccepted;
  }

  //OTP
  verifyOtp(otp) {
    console.log(otp);
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
        if (result.errorCode != null) {
          const message = this.multiLanguageService.instant(
            'payday_loan.error_code.' + result.errorCode.toLowerCase()
          );
          return this.showError('common.error', message);
        }
        console.log('confirm otp', this.passwordForgotForm.getRawValue());
        console.log('confirm otp success');
        this.otp = otp;
        this.openOtpConfirm = false;
        this.changePasswordForm = true;
      }));
  }

  resendOtp() {
    console.log('resend otp');
    this.getOtp();
  }

  redirectToResetPasswordSuccessPage() {
    this.router.navigateByUrl('/auth/reset-password-success');
  }

  showError(title: string, content: string) {
    return this.notificationService.openErrorModal({
      title: this.multiLanguageService.instant(title),
      content: this.multiLanguageService.instant(content),
      primaryBtnText: this.multiLanguageService.instant('common.confirm'),
    });
  }
}
