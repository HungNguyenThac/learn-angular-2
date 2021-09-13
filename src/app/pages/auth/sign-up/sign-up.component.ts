import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']
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
  openOtpConfirm: boolean = false
  otp: any = [];
  mobile: string = "";
  errorText: string = "";
  errorGetTngInfo: boolean = false;
  disabledOTP: boolean = false;

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
    private router: Router
  ) {
    this.signUpForm = this.formBuilder.group({
      mobileNumber: ["", [Validators.required, Validators.minLength(10), Validators.maxLength(10), Validators.pattern("^(09|03|07|08|05)([0-9]{8})")]],
      password: ["", [Validators.required, Validators.minLength(8), Validators.maxLength(50)]],
      confirmPassword: ["", [Validators.required, this.matchValues('password'), Validators.minLength(8), Validators.maxLength(50)]],
    })
  }

  ngOnInit(): void {
  }

  onSubmit() {
    console.log(this.signUpForm.getRawValue());
    this.openOtpConfirm = true
  }

  onRuleAccepted() {
    this.ruleAccepted = !this.ruleAccepted
  }

  //OTP
  verifyOtp(otp) {
    console.log(otp);
  }

  resendOtp() {
    console.log("resent")
  }
}
