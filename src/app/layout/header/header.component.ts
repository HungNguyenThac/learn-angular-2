import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import * as fromStore from '../../core/store';
import * as fromActions from '../../core/store';
import { Router } from '@angular/router';
import * as fromSelectors from '../../core/store/selectors';
import { Observable } from 'rxjs/Observable';
import { CustomerInfoResponse } from '../../../../open-api-modules/customer-api-docs';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit, OnDestroy {
  customerInfo$: Observable<CustomerInfoResponse>;
  showStepProgressBar$: Observable<boolean>;
  showStepNavigation$: Observable<boolean>;
  showProfileBtn$: Observable<boolean>;
  showLeftBtn$: Observable<boolean>;
  showRightBtn$: Observable<boolean>;
  navigationTitle$: Observable<string>;
  showNavigationBar$: Observable<boolean>;

  customerInfo: CustomerInfoResponse = null;
  logoSrc: string = 'assets/img/monex-logo.svg';
  isLogged: boolean = true;
  isSignUp: boolean = false;
  showStepProgressBar: boolean = false;
  showStepNavigation: boolean = false;
  displayLeftBtn: boolean = true;
  displayRightBtn: boolean = true;
  showProfileBtn: boolean = false;
  showNavigationBar: boolean = true;
  leftBtnIcon: string = 'sprite-group-3-icon-back';
  rightBtnIcon: string = 'sprite-group-3-help-white';
  titleNavigation: string = 'Ứng lương 0% lãi';

  subManager = new Subscription();

  constructor(private router: Router, private store: Store<fromStore.State>) {
    this._subscribeHeaderInfo();
  }

  ngOnInit(): void {}

  ngOnDestroy(): void {
    this.subManager.unsubscribe();
  }

  private _subscribeHeaderInfo() {
    this.customerInfo$ = this.store.select(fromSelectors.getCustomerInfoState);
    this.showStepProgressBar$ = this.store.select(
      fromSelectors.displayStepProgressBar
    );
    this.showStepNavigation$ = this.store.select(
      fromSelectors.displayStepNavigation
    );
    this.showProfileBtn$ = this.store.select(fromSelectors.displayProfileBtn);
    this.showLeftBtn$ = this.store.select(fromSelectors.displayLeftBtn);
    this.showRightBtn$ = this.store.select(fromSelectors.displayRightBtn);
    this.showNavigationBar$ = this.store.select(
      fromSelectors.displayNavigationBar
    );
    this.navigationTitle$ = this.store.select(fromSelectors.getNavigationTitle);

    this.subManager.add(
      this.customerInfo$.subscribe((customerInfo: CustomerInfoResponse) => {
        this.customerInfo = customerInfo;
      })
    );

    this.subManager.add(
      this.showStepProgressBar$.subscribe((show: boolean) => {
        this.showStepProgressBar = show;
      })
    );

    this.subManager.add(
      this.showStepNavigation$.subscribe((show: boolean) => {
        this.showStepNavigation = show;
      })
    );

    this.subManager.add(
      this.showProfileBtn$.subscribe((show: boolean) => {
        this.showProfileBtn = show;
      })
    );

    this.subManager.add(
      this.showLeftBtn$.subscribe((show: boolean) => {
        this.displayLeftBtn = show;
      })
    );

    this.subManager.add(
      this.showRightBtn$.subscribe((show: boolean) => {
        this.displayRightBtn = show;
      })
    );

    this.subManager.add(
      this.showNavigationBar$.subscribe((show: boolean) => {
        this.showNavigationBar = show;
      })
    );

    this.subManager.add(
      this.navigationTitle$.subscribe((navigationTitle: string) => {
        this.titleNavigation = navigationTitle;
      })
    );
  }

  backToPrevPage() {
    this.store.dispatch(new fromActions.ClickBackBtn());
  }

  logout() {
    this.store.dispatch(new fromActions.Logout(null));
    this.router.navigateByUrl('');
  }
}
