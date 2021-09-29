import { MultiLanguageService } from 'src/app/share/translate/multiLanguageService';
import { NotificationService } from 'src/app/core/services/notification.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiResponseObject } from 'open-api-modules/com-api-docs';
import {
  CreateCustomerAccountRequest,
  CreateVerifiedAccountRequest,
  SignOnControllerService,
} from 'open-api-modules/identity-api-docs';
import { Title } from '@angular/platform-browser';
import { GlobalConstants } from '../../../core/common/global-constants';
import * as fromActions from '../../../core/store';
import * as fromStore from '../../../core/store';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss'],
})
export class SignUpComponent implements OnInit, OnDestroy {
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

  createCustomerAccountRequestResult: any;

  subManager = new Subscription();

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private signOnControllerService: SignOnControllerService,
    private titleService: Title,
    private store: Store<fromStore.State>,
    private notificationService: NotificationService,
    private multiLanguageService: MultiLanguageService
  ) {
    this.signUpForm = this.formBuilder.group({
      mobileNumber: ['', [Validators.required]],
      password: ['', [Validators.required]],
      confirmPassword: ['', [Validators.required]],
    });
  }

  ngOnDestroy(): void {
    this.subManager.unsubscribe();
  }

  ngOnInit(): void {
    this.titleService.setTitle(
      'Đăng ký' + ' - ' + GlobalConstants.PL_VALUE_DEFAULT.PROJECT_NAME
    );
    this.initHeaderInfo();
    this.resetSession();
  }

  initHeaderInfo() {
    this.store.dispatch(new fromActions.ResetPaydayLoanInfo());
    this.store.dispatch(new fromActions.SetNavigationTitle('Đăng ký'));
    this.store.dispatch(new fromActions.SetShowLeftBtn(true));
    this.store.dispatch(new fromActions.SetShowRightBtn(false));
  }

  resetSession() {
    this.store.dispatch(new fromActions.Logout());
  }

  onSubmit() {
    if (!this.signUpForm.valid || !this.ruleAccepted) return;
    this.store.dispatch(
      new fromActions.SetCustomerMobile(
        this.signUpForm.controls.mobileNumber.value
      )
    );
    this.mobile = this.signUpForm.controls.mobileNumber.value;
    this.getOtp();
  }

  getOtp() {
    const createCustomerAccountRequest: CreateCustomerAccountRequest = {
      mobile: this.signUpForm.controls.mobileNumber.value,
      provider: 'cmc',
    };
    this.subManager.add(
      this.signOnControllerService
        .createCustomerAccount(createCustomerAccountRequest)
        .subscribe((result: ApiResponseObject) => {
          if (result.errorCode != null) {
            const message = this.multiLanguageService.instant(
              'payday_loan.error_code.' + result.errorCode.toLowerCase()
            );
            return this.showError('common.error', message);
          }

          this.createCustomerAccountRequestResult = result.result;

          if (this.openOtpConfirm === false) {
            this.openOtpConfirm = true;
          }
        })
    );
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
    this.subManager.add(
      this.signOnControllerService
        .createVerifiedCustomerAccount(createVerifiedAccountRequest)
        .subscribe((result) => {
          if (result.errorCode != null) {
            const message = this.multiLanguageService.instant(
              'payday_loan.error_code.' + result.errorCode.toLowerCase()
            );
            return this.showError('common.error', message);
          }
          this.store.dispatch(
            new fromActions.SetCustomerMobile(
              createVerifiedAccountRequest.mobile
            )
          );
          console.log('create Verified success');
          this.redirectToSignUpSuccessPage();
        })
    );
  }

  resendOtp() {
    console.log('resent');
    this.getOtp();
  }

  redirectToSignUpSuccessPage() {
    this.router.navigateByUrl('/auth/sign-up-success');
  }

  showError(title: string, content: string) {
    return this.notificationService.openErrorModal({
      title: this.multiLanguageService.instant(title),
      content: this.multiLanguageService.instant(content),
      primaryBtnText: this.multiLanguageService.instant('common.confirm'),
    });
  }
}
