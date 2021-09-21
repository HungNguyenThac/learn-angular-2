import { AfterViewInit, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import * as fromStore from './../../../core/store';
import * as fromActions from './../../../core/store';
import { Title } from '@angular/platform-browser';
import { GlobalConstants } from '../../../core/common/global-constants';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss'],
})
export class SignInComponent implements OnInit {
  signInForm: FormGroup;
  isUsernameInputFocus: boolean = false;
  isPasswordInputFocus: boolean = false;

  isPassVisible: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private store: Store<fromStore.State>,
    private titleService: Title
  ) {
    this.signInForm = this.formBuilder.group({
      mobileNumber: [''],
      password: [''],
    });
  }

  ngOnInit(): void {
    this.titleService.setTitle(
      'Đăng nhập' + ' - ' + GlobalConstants.PL_VALUE_DEFAULT.PROJECT_NAME
    );
    this.resetSession();
    this.initHeaderInfo();
  }

  onSubmit() {
    if (this.signInForm.invalid) {
      return;
    }

    const username = this.signInForm.controls.mobileNumber.value;
    const password = this.signInForm.controls.password.value;

    this.store.dispatch(new fromActions.Signin({ username, password }));
  }

  initHeaderInfo() {
    this.store.dispatch(new fromActions.ResetPaydayLoanInfo());
    this.store.dispatch(new fromActions.SetNavigationTitle('Đăng nhập'));
    this.store.dispatch(new fromActions.SetShowLeftBtn(true));
    this.store.dispatch(new fromActions.SetShowRightBtn(true));
  }

  resetSession() {
    this.store.dispatch(new fromActions.Logout());
  }
}
