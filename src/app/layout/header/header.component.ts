import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import * as fromStore from '../../core/store';
import * as fromActions from '../../core/store';
import { Router } from '@angular/router';
import * as fromSelectors from '../../core/store/selectors';
import { Observable } from 'rxjs/Observable';
import { CustomerInfoResponse } from '../../../../open-api-modules/customer-api-docs';
import { Subscription } from 'rxjs';
import {
  BUTTON_TYPE,
  NAV_ITEM,
  RESPONSE_CODE,
} from '../../core/common/enum/operator';
import { MultiLanguageService } from '../../share/translate/multiLanguageService';
import { MatDialog } from '@angular/material/dialog';
import { DialogUserInfoUpdateComponent } from '../../share/components';
import {
  AdminAccountControllerService,
  UpdateInfoAdminAccountRequest,
} from '../../../../open-api-modules/identity-api-docs';
import { AdminAccountEntity } from '../../../../open-api-modules/dashboard-api-docs';
import { ToastrService } from 'ngx-toastr';

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
          queryParams: { groupName: 'HMG' },
          canActivate: ['dashboardHmgApplications:findApplications'],
        },
        {
          title: this.multiLanguageService.instant(
            'header.navigation.loanapp_tng'
          ),
          iconClass: 'sprite-group-5-pl-24',
          path: '/payday-loan/list',
          queryParams: { groupName: 'TNG' },
          canActivate: ['dashboardTngApplications:findApplications'],
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

  openUpdateDialog() {
    const updateDialogRef = this.dialog.open(DialogUserInfoUpdateComponent, {
      panelClass: 'custom-info-dialog-container',
      maxWidth: '800px',
      width: '90%',
      data: this.userInfo,
    });
    this.subManager.add(
      updateDialogRef.afterClosed().subscribe((result: any) => {
        if (result && result.type === BUTTON_TYPE.PRIMARY) {
          this.updateUserInfo({
            fullName: result?.data.fullName,
            mobile: result?.data.mobile,
            note: result?.data.note,
          });
        }
      })
    );
  }

  updateUserInfo(updateUserInfoRequest: UpdateInfoAdminAccountRequest) {
    console.log('updateUserInfoRequest', updateUserInfoRequest);
    this.subManager.add(
      this.adminAccountControllerService
        .updateInfo(updateUserInfoRequest)
        .subscribe((response) => {
          if (response.responseCode !== RESPONSE_CODE.SUCCESS) {
            this.notifier.error(
              JSON.stringify(response?.message),
              response?.errorCode
            );
            return;
          }
          setTimeout(() => {
            this.store.dispatch(new fromActions.GetCustomerInfo());
            this.notifier.success(
              this.multiLanguageService.instant('common.update_success')
            );
          }, 1000);
        })
    );
  }

  onClickManageUser() {
    this.router.navigateByUrl('/system/user/list');
  }

  onClickPdGroup() {
    this.router.navigateByUrl('/system/pd-group/list');
  }

  onClickPdQuestions() {
    this.router.navigateByUrl('/system/pd-questions/list');
  }

  onClickPdAnswers() {
    this.router.navigateByUrl('/system/pd-answers/list');
  }

  onClickPdModel() {
    this.router.navigateByUrl('/system/pd-model/list');
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
}
