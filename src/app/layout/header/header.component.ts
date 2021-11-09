import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import * as fromStore from '../../core/store';
import * as fromActions from '../../core/store';
import { Router } from '@angular/router';
import * as fromSelectors from '../../core/store/selectors';
import { Observable } from 'rxjs/Observable';
import { CustomerInfoResponse } from '../../../../open-api-modules/customer-api-docs';
import { Subscription } from 'rxjs';
import { BUTTON_TYPE, NAV_ITEM } from '../../core/common/enum/operator';
import { MultiLanguageService } from '../../share/translate/multiLanguageService';
import { DialogCompanyInfoUpdateComponent } from '../../share/components';
import { MatDialog } from '@angular/material/dialog';
import { DialogUserInfoUpdateComponent } from '../../share/components/operators/user-account/dialog-user-info-update/dialog-user-info-update.component';
import { AddNewUserDialogComponent } from '../../share/components/operators/user-account/add-new-user-dialog/add-new-user-dialog.component';

export interface AccountInfo {
  fullName?: string;
  loginName?: string;
  roleName?: string;
  phoneNum?: string;
  email?: string;
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
      subItems: [
        {
          title: this.multiLanguageService.instant(
            'header.navigation.loanapp_hmg'
          ),
          iconClass: 'sprite-group-5-pl-24',
          path: '/payday-loan/list',
          queryParams: { groupName: 'HMG' },
        },
        {
          title: this.multiLanguageService.instant(
            'header.navigation.loanapp_tng'
          ),
          iconClass: 'sprite-group-5-pl-24',
          path: '/payday-loan/list',
          queryParams: { groupName: 'TNG' },
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
    },
    {
      navItem: NAV_ITEM.INSURANCE,
      title: this.multiLanguageService.instant('header.navigation.insurance'),
      defaultIconClass: 'sprite-group-5-shield-check',
      activeIconClass: 'sprite-group-5-shield-check-white',
      path: '/',
    },
    {
      navItem: NAV_ITEM.SAVING,
      title: this.multiLanguageService.instant('header.navigation.saving'),
      defaultIconClass: 'sprite-group-5-invest',
      activeIconClass: 'sprite-group-5-invest-white',
      path: '/',
    },
  ];

  subManager = new Subscription();

  constructor(
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
        accountNote: this.accountInfo.note,
      },
    });
    this.subManager.add(
      updateDialogRef.afterClosed().subscribe((result: any) => {
        if (result && result.type === BUTTON_TYPE.PRIMARY) {
          console.log(result);
        }
      })
    );
  }

  openAddUserDialog() {
    const updateDialogRef = this.dialog.open(AddNewUserDialogComponent, {
      panelClass: 'custom-info-dialog-container',
      maxWidth: '800px',
      width: '90%',
    });
    this.subManager.add(
      updateDialogRef.afterClosed().subscribe((result: any) => {
        if (result && result.type === BUTTON_TYPE.PRIMARY) {
          console.log(result);
        }
      })
    );
  }

  logout() {
    this.store.dispatch(new fromActions.Logout(null));
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
  }
}
