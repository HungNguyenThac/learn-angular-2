import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit {
  passwordForgotForm: FormGroup;
  isUsernameInputFocus: boolean = false;

  changePasswordForm: boolean = false;
  ruleAccepted: boolean = false;
  //OTP
  openOtpConfirm: boolean = false
  otp: any = [];
  mobile: string = "";
  errorText: string = "";
  errorGetTngInfo: boolean = false;
  disabledOTP: boolean = false;

  constructor(
    private formBuilder: FormBuilder
  ) {
    this.passwordForgotForm = this.formBuilder.group({
      mobileNumber: ["", [Validators.required]],
      password: ["", [Validators.required]],
      confirmPassword: ["", [Validators.required]],
    })
  }

  ngOnInit(): void {
  }

  onOpenOtpConfirm() {
    console.log(this.passwordForgotForm.getRawValue());
    this.openOtpConfirm = true
  }

  onSubmit() {
    console.log(this.passwordForgotForm.getRawValue());
    this.ruleAccepted = false
    this.changePasswordForm = false
  }

  onRuleAccepted() {
    this.ruleAccepted = !this.ruleAccepted
  }

  //OTP
  verifyOtp(otp) {
    console.log(otp);
    this.openOtpConfirm = false
    this.changePasswordForm = true
  }

  resendOtp() {
    console.log("resent")
  }
}
