import { LoanListComponent } from './loan-list/loan-list.component';
import { Routes } from '@angular/router';

export const PaydayLoanRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'list',
        component: LoanListComponent,
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
