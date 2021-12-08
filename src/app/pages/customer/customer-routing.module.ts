import { Routes } from '@angular/router';
import { CustomerListComponent } from './customer-list/customer-list.component';
// import { AuthGuardService as AuthGuard } from '../../../core/services/auth-guard.service';
import { NgxPermissionsGuard } from 'ngx-permissions';

export const CustomerRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'list',
        component: CustomerListComponent,
        canActivate: [NgxPermissionsGuard],
        data: {
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
