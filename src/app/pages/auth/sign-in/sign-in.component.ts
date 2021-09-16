import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import * as fromStore from './../../../core/store';
import * as fromActions from './../../../core/store';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss'],
})
export class SignInComponent implements OnInit {
  public error$: Observable<any>;
  signInForm: FormGroup;
  isUsernameInputFocus: boolean = false;
  isPasswordInputFocus: boolean = false;

  isPassVisible: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private store: Store<fromStore.State>,
    private notifier: ToastrService
  ) {
    this.error$ = store.select(fromStore.getLoginErrorState);

    this.signInForm = this.formBuilder.group({
      mobileNumber: [''],
      password: [''],
    });
  }

  ngOnInit(): void {
    this.store.dispatch(new fromActions.Logout(null));
    this.store.dispatch(new fromActions.SigninError(null));

    this.error$.subscribe((error) => {
      console.log('error', error);
      if (error != null) {
        this.notifier.error(error);
      }
    });
  }

  onSubmit() {
    console.log(this.signInForm.getRawValue());
    if (this.signInForm.invalid) {
      return;
    }
    const username = this.signInForm.controls.mobileNumber.value;
    const password = this.signInForm.controls.password.value;

    this.store.dispatch(new fromActions.Signin({ username, password }));


  }
}
