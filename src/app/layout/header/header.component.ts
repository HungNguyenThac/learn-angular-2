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
import { DialogCompanyInfoUpdateComponent } from '../../share/components';
import { MatDialog } from '@angular/material/dialog';
import { DialogUserInfoUpdateComponent } from '../../share/components/operators/user-account/dialog-user-info-update/dialog-user-info-update.component';
import {
  AdminAccountControllerService,
  ApiResponseAdminAccountEntity,
} from '../../../../open-api-modules/identity-api-docs';

export interface AccountInfo {
  fullName?: string;
  loginName?: string;
  roleName?: string;
  phoneNum?: string;
  email?: string;
  position?: string;
  note?: string;
}

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit, OnDestroy {
  customerInfo$: Observable<CustomerInfoResponse>;
  authorization$: Observable<any>;
  activeNavItem$: Observable<any>;
  responsive: boolean = false;
  customerInfo: CustomerInfoResponse = null;
  logoSrc: string = 'assets/img/monex-logo.svg';
  showProfileBtn: boolean = false;
  shortName: string = '0';

  accountInfo: AccountInfo = {
    fullName: 'Nguyễn Văn A',
    loginName: 'ngvana',
    roleName: 'Super Admin',
    phoneNum: '0943777294',
    email: 'a.nguyen@epay.vn',
    position: 'Kế toán',
    note: '',
  };
  selectedNavItem: NAV_ITEM = NAV_ITEM.DASHBOARD;
  menuItems = [
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
      canActivate: ['ADMIN', 'MODERATOR'],
      subItems: [
        {
          title: this.multiLanguageService.instant(
            'header.navigation.loanapp_hmg'
          ),
          iconClass: 'sprite-group-5-pl-24',
          path: '/payday-loan/list',
          queryParams: { groupName: 'HMG' },
          canActivate: ['ADMIN', 'MODERATOR'],
        },
        {
          title: this.multiLanguageService.instant(
            'header.navigation.loanapp_tng'
          ),
          iconClass: 'sprite-group-5-pl-24',
          path: '/payday-loan/list',
          queryParams: { groupName: 'TNG' },
          canActivate: ['ADMIN', 'MODERATOR'],
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
      canActivate: ['ADMIN', 'MODERATOR'],
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
  userInfo;
  subManager = new Subscription();

  constructor(
    private adminAccountControllerService: AdminAccountControllerService,
    private router: Router,
    private store: Store<fromStore.State>,
    private dialog: MatDialog,
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

  backToPrevPage() {
    this.store.dispatch(new fromActions.ClickBackBtn());
  }

  openUpdateDialog() {
    const updateDialogRef = this.dialog.open(DialogUserInfoUpdateComponent, {
      panelClass: 'custom-info-dialog-container',
      maxWidth: '800px',
      width: '90%',
      data: {
        accountName: this.accountInfo.fullName,
        accountLogin: this.accountInfo.loginName,
        accountRole: this.accountInfo.roleName,
        accountPhone: this.accountInfo.phoneNum,
        accountEmail: this.accountInfo.email,
        accountPosition: this.accountInfo.position,
        accountNote: this.accountInfo.note,
      },
    });
  }

  onClickManageUser() {
    this.router.navigateByUrl('user/list');
  }

  logout() {
    this.store.dispatch(new fromActions.Logout(null));
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
    this.subManager.add(
      this.activeNavItem$.subscribe((selectedNavItem: NAV_ITEM) => {
        console.log('selectedNavItem', selectedNavItem);
        this.selectedNavItem = selectedNavItem;
      })
    );
    this.subManager.add(
      this.adminAccountControllerService
        .getInFo()
        .subscribe((result: ApiResponseAdminAccountEntity) => {
          if (!result || result.responseCode !== 200) {
            // return this.handleResponseError(result.errorCode);
          }
          this.userInfo = result.result;
          console.log(this.userInfo);
        })
    );
  }
}
