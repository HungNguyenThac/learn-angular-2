import { Routes } from '@angular/router';
import { CustomerListComponent } from './customer-list/customer-list.component';
// import { AuthGuardService as AuthGuard } from '../../../core/services/auth-guard.service';
import { NgxPermissionsGuard } from 'ngx-permissions';
import { TitleConstants } from '../../core/common/providers/title-constants';

export const CustomerRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'list',
        component: CustomerListComponent,
        canActivateChild: [NgxPermissionsGuard],
        data: {
          title: TitleConstants.TITLE_VALUE.CUSTOMER,
          animation: true,
          permissions: {
            only: ['dashboardCustomers:getCustomers'],
            redirectTo: '/',
          },
        },
      },
    ],
  },
];
