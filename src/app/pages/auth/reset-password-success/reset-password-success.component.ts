import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { GlobalConstants } from '../../../core/common/global-constants';
import * as moment from 'moment';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-reset-password-success',
  templateUrl: './reset-password-success.component.html',
  styleUrls: ['./reset-password-success.component.scss'],
})
export class ResetPasswordSuccessComponent
  implements OnInit, AfterViewInit, OnDestroy
{
  countdownTime: number =
    GlobalConstants.PL_VALUE_DEFAULT.REDIRECT_TO_SIGN_IN_COUNTDOWN_TIME;
  intervalTime: any;

  constructor(private router: Router, private titleService: Title) {}

  ngOnInit(): void {
    this.titleService.setTitle('Quên mật khẩu thành công - Monex');
  }

  ngAfterViewInit(): void {
    this.countdownTimer(this.countdownTime);
  }

  btnClick() {
    this.redirectToSignInPage();
  }

  redirectToSignInPage() {
    this.router.navigateByUrl('/auth/sign-in').then((r) => {});
  }

  countdownTimer(second) {
    let duration = moment.duration(second * 1000, 'milliseconds');
    let interval = 1000;
    let intervalProcess = (this.intervalTime = setInterval(() => {
      duration = moment.duration(
        duration.asMilliseconds() - interval,
        'milliseconds'
      );
      document.getElementById('forgot-pass-countdown-time').textContent =
        '( ' + duration.asSeconds() + 's )';
      if (duration.asSeconds() == 0) {
        clearInterval(intervalProcess);
        this.redirectToSignInPage();
      }
    }, interval));
  }

  destroyCountdownTimer() {
    clearInterval(this.intervalTime);
  }

  ngOnDestroy(): void {
    this.destroyCountdownTimer();
  }
}
