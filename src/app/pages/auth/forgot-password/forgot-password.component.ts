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

  matchValues(
    matchTo: string // name of the control to match to
  ): (AbstractControl) => ValidationErrors | null {
    return (control: AbstractControl): ValidationErrors | null => {
      return !!control.parent &&
        !!control.parent.value &&
        control.value === control.parent.controls[matchTo].value
        ? null
        : { isMatching: false };
    };
  }

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private signOnControllerService: SignOnControllerService,
    private notifier: ToastrService,
    private titleService: Title
  ) {
    this.passwordForgotForm = this.formBuilder.group({
      mobileNumber: ['', [Validators.required]],
      password: ['', [Validators.required]],
      confirmPassword: [
        '',
        [Validators.required, this.matchValues('password')],
      ],
    });
  }

  ngOnInit(): void {
    this.titleService.setTitle('Quên mật khẩu'  + " - " + GlobalConstants.PL_VALUE_DEFAULT.PROJECT_NAME);
  }

  getOtp() {
    const createCustomerAccountRequest: CreateCustomerAccountRequest = {
      mobile: this.passwordForgotForm.controls.mobileNumber.value,
      provider: 'cmc',
    };
    this.signOnControllerService
      .resetPasswordbyMobileOtp(createCustomerAccountRequest)
      .subscribe((data) => {
        if (data.errorCode != null) {
          return this.notifier.error(String(data?.message));
        }

        this.resetPasswordbyMobileOtpResult = data.result;
      });
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
    this.signOnControllerService
      .resetPasswordbyOtp(resetPasswordVerifiedAccountRequest)
      .subscribe((result) => {
        if (result.errorCode != null) {
          return this.notifier.error(result.message);
        }

        console.log('reset password Verified success');
        this.redirectToResetPasswordSuccessPage();
      });
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
    this.signOnControllerService
      .resetPasswordVerifiedOtp(resetVerifiedPasswordOtpRequest)
      .subscribe((result) => {
        if (result.errorCode != null) {
          return this.notifier.error(result.message);
        }
        console.log('confirm otp', this.passwordForgotForm.getRawValue());
        console.log('confirm otp success');
        this.otp = otp;
        this.openOtpConfirm = false;
        this.changePasswordForm = true;
      });
  }

  resendOtp() {
    console.log('resend otp');
    this.getOtp();
  }

  redirectToResetPasswordSuccessPage() {
    this.router.navigateByUrl('/auth/reset-password-success');
  }
}
