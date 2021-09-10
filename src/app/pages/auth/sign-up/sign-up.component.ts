import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
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

  constructor(
    private formBuilder: FormBuilder,
    private router: Router
  ) {
    this.signUpForm = this.formBuilder.group({
      mobileNumber: ["", [Validators.required]],
      password: ["", [Validators.required]],
      confirmPassword: ["", [Validators.required]],
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
