import { LoanListComponent } from './loan-list/loan-list.component';
import { Routes } from '@angular/router';
// import { AuthGuardService as AuthGuard } from '../../../core/services/auth-guard.service';

export const LoanRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'list',
        component: LoanListComponent,
        data: { animation: true },
      },
    ],
  },
];
