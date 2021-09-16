import { HttpErrorResponse } from '@angular/common/http';
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
  CreateVerifiedAccountRequest,
  SignOnControllerService,
} from 'open-api-modules/identity-api-docs';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss'],
})
export class SignUpComponent implements OnInit {
  signUpForm: FormGroup;
  isUsernameInputFocus: boolean = false;
  isPasswordInputFocus: boolean = false;
  isConfirmPasswordInputFocus: boolean = false;

  isPassVisible: boolean = false;
  isConfirmPassVisible: boolean = false;

  ruleAccepted: boolean = false;

  //OTP
  openOtpConfirm: boolean = false;
  otp: any = [];
  mobile: string = '';
  errorText: string = '';
  errorGetTngInfo: boolean = false;
  disabledOTP: boolean = false;

  //
  createCustomerAccountRequestResult: any;

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
    private notifier: ToastrService
  ) {
    this.signUpForm = this.formBuilder.group({
      mobileNumber: ['', [Validators.required]],
      password: ['', [Validators.required]],
      confirmPassword: [
        '',
        [Validators.required, this.matchValues('password')],
      ],
    });
  }

  ngOnInit(): void {}

  onSubmit() {
    if (!this.signUpForm.valid || !this.ruleAccepted) return;
    this.getOtp();
  }

  getOtp() {
    const createCustomerAccountRequest: CreateCustomerAccountRequest = {
      mobile: this.signUpForm.controls.mobileNumber.value,
      provider: 'cmc',
    };
    this.signOnControllerService
      .createCustomerAccount(createCustomerAccountRequest)
      .subscribe((data: ApiResponseObject) => {
        if (data.errorCode != null) {
          return this.notifier.error(String(data?.message));
        }

        this.createCustomerAccountRequestResult = data.result;

        if (this.openOtpConfirm === false) {
          this.openOtpConfirm = true;
        }
      });
  }

  onRuleAccepted() {
    this.ruleAccepted = !this.ruleAccepted;
  }

  //OTP
  verifyOtp(otp) {
    console.log(otp);
    const requestId = this.createCustomerAccountRequestResult.requestId;
    const signature = this.createCustomerAccountRequestResult.signature;
    const createVerifiedAccountRequest: CreateVerifiedAccountRequest = {
      mobile: this.signUpForm.controls.mobileNumber.value,
      password: this.signUpForm.controls.password.value,
      signature: signature,
      requestId: requestId,
      otp: otp,
    };
    this.signOnControllerService
      .createVerifiedCustomerAccount(createVerifiedAccountRequest)
      .subscribe((result) => {
        if (result.errorCode != null) {
          return this.notifier.error(`data.message`);
        }
        console.log('create Verified success');
        this.redirectToSignUpSuccessPage();
      });
  }

  resendOtp() {
    console.log('resent');
    this.getOtp();
  }

  redirectToSignUpSuccessPage() {
    this.router.navigateByUrl('/auth/sign-up-success');
  }
}
