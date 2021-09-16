import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { GlobalConstants } from '../../../core/common/global-constants';
import { Router } from '@angular/router';
import * as moment from 'moment';

@Component({
  selector: 'app-sign-up-success',
  templateUrl: './sign-up-success.component.html',
  styleUrls: ['./sign-up-success.component.scss'],
})
export class SignUpSuccessComponent
  implements OnInit, AfterViewInit, OnDestroy
{
  signUpSuccessBodyText: string = '';
  countdownTime: number =
    GlobalConstants.PL_VALUE_DEFAULT.REDIRECT_TO_SIGN_IN_COUNTDOWN_TIME;
  intervalTime: any;

  constructor(private router: Router) {}

  ngOnInit(): void {}

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
      document.getElementById('sign-up-success-countdown-timer').textContent =
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
