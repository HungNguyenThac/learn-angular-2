import { LoanListComponent } from './loan-list/loan-list.component';
import { Routes } from '@angular/router';
import { NgxPermissionsGuard } from 'ngx-permissions';
import { TitleConstants } from '../../../core/common/providers/title-constants';

export const PaydayLoanRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'list',
        component: LoanListComponent,
        canActivateChild: [NgxPermissionsGuard],
        data: {
          title: TitleConstants.TITLE_VALUE.PAYDAY_LOAN,
          animation: true,
          permissions: {
            only: [
              'dashboardHmgApplications:findApplications',
              'dashboardTngApplications:findApplications',
            ],
            redirectTo: '/',
          },
        },
      },
    ],
  },
];
