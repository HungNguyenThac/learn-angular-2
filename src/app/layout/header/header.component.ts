import { Component, Input, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import * as fromStore from '../../core/store';
import * as fromActions from '../../core/store';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  @Input() titleNavigation: string = 'Ứng lương 0% lãi';
  logoSrc: string = 'assets/img/monex-logo.svg';
  isLogged: boolean = true;
  isSignUp: boolean = false;
  showStepProgressBar: boolean = false;
  showStepNavigation: boolean = true;
  displayLeftBtn: boolean = true;
  displayRightBtn: boolean = true;
  leftBtnIcon: string = 'sprite-group-3-icon-back';
  rightBtnIcon: string = 'sprite-group-3-help-white';

  constructor(private router: Router, private store: Store<fromStore.State>) {}

  ngOnInit(): void {}

  logout() {
    this.store.dispatch(new fromActions.Logout(null));
    this.router.navigateByUrl('introduce').then((r) => {});
  }
}
