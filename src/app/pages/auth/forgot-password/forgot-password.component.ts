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

  constructor(
    private formBuilder: FormBuilder
  ) {
    this.passwordForgotForm = this.formBuilder.group({
      mobileNumber: ["", [Validators.required, Validators.minLength(10), Validators.maxLength(10), Validators.pattern("^(09|03|07|08|05)([0-9]{8})")]],
    })
  }

  ngOnInit(): void {
  }

  onSubmit() {
    console.log(this.passwordForgotForm.getRawValue());
    
  }
}
