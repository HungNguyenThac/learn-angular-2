import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import * as fromStore from '../../../core/store';
import * as fromActions from '../../../core/store';
import { Router } from '@angular/router';
import * as fromSelectors from '../../../core/store/selectors';
import { Observable } from 'rxjs/Observable';
import { CustomerInfoResponse } from '../../../../../open-api-modules/customer-api-docs';
import { Subscription } from 'rxjs';
import { NAV_ITEM } from '../../../core/common/enum/operator';
import { MultiLanguageService } from '../../../share/translate/multiLanguageService';
import { MatDialog } from '@angular/material/dialog';
import {
  AdminAccountControllerService,
  ApiResponseString,
  SignOnControllerService,
} from '../../../../../open-api-modules/identity-api-docs';
import { AdminAccountEntity } from '../../../../../open-api-modules/dashboard-api-docs';
import { ToastrService } from 'ngx-toastr';
import { MenuItemModel } from '../../../public/models/external/menu-item.model';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit, OnDestroy {
  customerInfo$: Observable<AdminAccountEntity>;
  authorization$: Observable<any>;
  activeNavItem$: Observable<any>;
  responsive: boolean = false;
  customerInfo: CustomerInfoResponse = null;
  logoSrc: string = 'assets/img/monex-logo.svg';
  showProfileBtn: boolean = false;
  shortName: string = '0';
  userInfo: AdminAccountEntity;
  resizeTimeout: any;

  selectedNavItem: NAV_ITEM = NAV_ITEM.DASHBOARD;
  menuItems: MenuItemModel[] = [
    {
      navItem: NAV_ITEM.DASHBOARD,
      title: this.multiLanguageService.instant('header.navigation.dashboard'),
      defaultIconClass: 'sprite-group-5-home',
      activeIconClass: 'sprite-group-5-home-white',
      path: '/',
    },
    {
      navItem: NAV_ITEM.LOANAPP,
      title: this.multiLanguageService.instant('header.navigation.loanapp'),
      defaultIconClass: 'sprite-group-5-coin',
      activeIconClass: 'sprite-group-5-coin-white',
      canActivate: [
        'dashboardHmgApplications:findApplications',
        'dashboardTngApplications:findApplications',
      ],
      subItems: [
        {
          title: this.multiLanguageService.instant(
            'header.navigation.loanapp_hmg'
          ),
          iconClass: 'sprite-group-5-pl-24',
          path: '/payday-loan/list',
          queryParams: {groupName: 'HMG'},
          canActivate: ['dashboardHmgApplications:findApplications'],
        },
        {
          title: this.multiLanguageService.instant(
            'header.navigation.loanapp_tng'
          ),
          iconClass: 'sprite-group-5-pl-24',
          path: '/payday-loan/list',
          queryParams: {groupName: 'TNG'},
          canActivate: ['dashboardTngApplications:findApplications'],
        },
        {
          title: this.multiLanguageService.instant(
            'header.navigation.loanapp_vac'
          ),
          iconClass: 'sprite-group-5-pl-24',
          path: '/payday-loan/list',
          queryParams: { groupName: 'VAC' },
          canActivate: [],
        },
      ],
      path: '/payday-loan/list',
    },
    {
      navItem: NAV_ITEM.CUSTOMER,
      title: this.multiLanguageService.instant('header.navigation.customer'),
      defaultIconClass: 'sprite-group-5-customer',
      activeIconClass: 'sprite-group-5-customer-white',
      path: '/customer/list',
      canActivate: ['dashboardCustomers:getCustomers'],
    },
    {
      navItem: NAV_ITEM.MERCHANT,
      title: this.multiLanguageService.instant('header.navigation.merchant'),
      defaultIconClass: 'sprite-group-5-customer',
      activeIconClass: 'sprite-group-5-customer-white',
      path: '/system/merchant/list',
      canActivate: [],
    },
    // {
    //   navItem: NAV_ITEM.INSURANCE,
    //   title: this.multiLanguageService.instant('header.navigation.insurance'),
    //   defaultIconClass: 'sprite-group-5-shield-check',
    //   activeIconClass: 'sprite-group-5-shield-check-white',
    //   path: '/',
    // },
    // {
    //   navItem: NAV_ITEM.SAVING,
    //   title: this.multiLanguageService.instant('header.navigation.saving'),
    //   defaultIconClass: 'sprite-group-5-invest',
    //   activeIconClass: 'sprite-group-5-invest-white',
    //   path: '/',
    // },
  ];
  subManager = new Subscription();

  constructor(
    private adminAccountControllerService: AdminAccountControllerService,
    private router: Router,
    private store: Store<fromStore.State>,
    private dialog: MatDialog,
    private multiLanguageService: MultiLanguageService,
    private signOnControllerService: SignOnControllerService,
    private notifier: ToastrService
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

  backToPrevPage() {
    this.store.dispatch(new fromActions.ClickBackBtn());
  }

  navigateToHomePage() {
    this.router.navigateByUrl('');
  }

  private _subscribeHeaderInfo() {
    this.customerInfo$ = this.store.select(fromSelectors.getCustomerInfoState);
    this.activeNavItem$ = this.store.select(
      fromSelectors.getActiveNavItemState
    );
    this.authorization$ = this.store.select(
      fromSelectors.getAuthorizationState
    );
    this.subManager.add(
      this.customerInfo$.subscribe((userInfo: AdminAccountEntity) => {
        this.userInfo = userInfo;
        if (userInfo?.fullName) {
          const names = userInfo?.fullName.split(' ');
          this.shortName = names[names.length - 1].charAt(0);
        } else {
          this.shortName = '0';
        }
      })
    );
    this.subManager.add(
      this.authorization$.subscribe((authorization: any) => {
        this.showProfileBtn = !!authorization;
      })
    );
    this.subManager.add(
      this.activeNavItem$.subscribe((selectedNavItem: NAV_ITEM) => {
        console.log('selectedNavItem', selectedNavItem);
        this.selectedNavItem = selectedNavItem;
      })
    );
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    //debounce resize, wait for resize to finish before doing stuff
    if (this.resizeTimeout) {
      clearTimeout(this.resizeTimeout);
    }

    this.resizeTimeout = setTimeout(() => {
      this.onResponsiveInverted();
    }, 200);
  }
}
