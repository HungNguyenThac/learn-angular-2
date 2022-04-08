import { LoanListComponent } from './payday-loan/loan-list/loan-list.component';
import { Routes } from '@angular/router';
import { NgxPermissionsGuard } from 'ngx-permissions';
import { TitleConstants } from '../../core/common/providers/title-constants';
import {BnplListComponent} from "./bnpl/bnpl-list/bnpl-list.component";

export const ProductRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'payday-loan',
        component: LoanListComponent,
        canActivateChild: [NgxPermissionsGuard],
        data: {
          title: TitleConstants.TITLE_VALUE.PAYDAY_LOAN,
          animation: true,
          permissions: {
            only: [
              'dashboardHmgApplications:findApplications',
              'dashboardApplications:findTngApplications',
              'dashboardApplications:findVacApplications',
            ],
            redirectTo: '/',
          },
        },
      },
      {
        path: 'bnpl',
        component: BnplListComponent,
        canActivateChild: [NgxPermissionsGuard],
        data: {
          title: TitleConstants.TITLE_VALUE.BNPL,
          animation: true,
          permissions: {
            only: [
              'dashboardBnplApplications:findBnplApplications',
            ],
            redirectTo: '/',
          },
        },
      },
    ],
  },
];
