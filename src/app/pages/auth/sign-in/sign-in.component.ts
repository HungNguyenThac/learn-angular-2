import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss']
})
export class SignInComponent implements OnInit {
  signInForm: FormGroup;
  isUsernameInputFocus: boolean = false;
  isPasswordInputFocus: boolean = false;

  isPassVisible: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
  ) {
    this.signInForm = this.formBuilder.group({
      mobileNumber: ["", [Validators.required, Validators.minLength(10), Validators.maxLength(10), Validators.pattern("^(09|03|07|08|05)([0-9]{8})")]],
      password: ["", [Validators.required, Validators.minLength(8), Validators.maxLength(50)]],
    })
  }

  ngOnInit(): void {
  }

  onSubmit() {
    console.log(this.signInForm.getRawValue());
    
  }
}
