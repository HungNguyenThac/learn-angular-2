import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import * as fromStore from '../../core/store';
import * as fromActions from '../../core/store';
import { Router } from '@angular/router';
import * as fromSelectors from '../../core/store/selectors';
import { Observable } from 'rxjs/Observable';
import { CustomerInfoResponse } from '../../../../open-api-modules/customer-api-docs';
import { Subscription } from 'rxjs';
import { NAV_ITEM } from '../../core/common/enum/operator';
import { MultiLanguageService } from '../../share/translate/multiLanguageService';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit, OnDestroy {
  customerInfo$: Observable<CustomerInfoResponse>;
  authorization$: Observable<any>;
  responsive: boolean = false;

  customerInfo: CustomerInfoResponse = null;
  logoSrc: string = 'assets/img/monex-logo.svg';
  showProfileBtn: boolean = false;
  shortName: string = '0';
  fullName: string = 'Nguyễn Thị Admin';
  roleName: string = 'Super admin';
  selectedNavItem: NAV_ITEM = NAV_ITEM.DASHBOARD;
  navItemOptions = NAV_ITEM;
  menuItems: any = [
    {
      navItem: NAV_ITEM.DASHBOARD,
      title: this.multiLanguageService.instant('header.navigation.dashboard'),
      iconClass:
        this.selectedNavItem === NAV_ITEM.DASHBOARD
          ? 'sprite-group-5-home-white'
          : 'sprite-group-5-home',
      path: '/',
    },
    {
      navItem: NAV_ITEM.LOANAPP,
      title: this.multiLanguageService.instant('header.navigation.loanapp'),
      iconClass:
        this.selectedNavItem === NAV_ITEM.LOANAPP
          ? 'sprite-group-5-coin-white'
          : 'sprite-group-5-coin',
      path: '/',
    },
    {
      navItem: NAV_ITEM.CUSTOMER,
      title: this.multiLanguageService.instant('header.navigation.customer'),
      iconClass:
        this.selectedNavItem === NAV_ITEM.CUSTOMER
          ? 'sprite-group-5-customer-white'
          : 'sprite-group-5-customer',
      path: '/',
    },
    {
      navItem: NAV_ITEM.INSURANCE,
      title: this.multiLanguageService.instant('header.navigation.insurance'),
      iconClass:
        this.selectedNavItem === NAV_ITEM.INSURANCE
          ? 'sprite-group-5-shield-check-white'
          : 'sprite-group-5-shield-check',
      path: '/',
    },
    {
      navItem: NAV_ITEM.SAVING,
      title: this.multiLanguageService.instant('header.navigation.saving'),
      iconClass:
        this.selectedNavItem === NAV_ITEM.SAVING
          ? 'sprite-group-5-invest-white'
          : 'sprite-group-5-invest',
      path: '/',
    },
  ];

  subManager = new Subscription();

  constructor(
    private router: Router,
    private store: Store<fromStore.State>,
    private multiLanguageService: MultiLanguageService
  ) {
    this._subscribeHeaderInfo();
  }

  ngOnInit(): void {
    this.onResponsiveInverted();
    window.addEventListener('resize', this.onResponsiveInverted);
  }

  ngOnDestroy(): void {
    window.removeEventListener('resize', this.onResponsiveInverted);
    this.subManager.unsubscribe();
  }

  onResponsiveInverted() {
    this.responsive = window.innerWidth < 768;
  }

  private _subscribeHeaderInfo() {
    this.customerInfo$ = this.store.select(fromSelectors.getCustomerInfoState);
    this.authorization$ = this.store.select(
      fromSelectors.getAuthorizationState
    );

    this.subManager.add(
      this.customerInfo$.subscribe((customerInfo: CustomerInfoResponse) => {
        this.customerInfo = customerInfo;
        if (customerInfo?.personalData?.firstName) {
          const names = customerInfo.personalData.firstName.split(' ');
          this.shortName = names[names.length - 1].charAt(0);
          return;
        }
        this.shortName = '0';
      })
    );

    this.subManager.add(
      this.authorization$.subscribe((authorization: any) => {
        this.showProfileBtn = !!authorization;
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
