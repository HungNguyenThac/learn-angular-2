import { Routes } from '@angular/router';
import { CustomerListComponent } from './customer-list/customer-list.component';
// import { AuthGuardService as AuthGuard } from '../../../core/services/auth-guard.service';

export const CustomerRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'list',
        component: CustomerListComponent,
        data: { animation: true },
      },
    ],
  },
];
