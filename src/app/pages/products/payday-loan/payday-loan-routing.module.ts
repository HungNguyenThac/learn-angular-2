import { LoanListComponent } from './loan-list/loan-list.component';
import { Routes } from '@angular/router';
import {NgxPermissionsGuard} from "ngx-permissions";

export const PaydayLoanRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'list',
        component: LoanListComponent,
        canActivateChild: [NgxPermissionsGuard],
        data: {
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
