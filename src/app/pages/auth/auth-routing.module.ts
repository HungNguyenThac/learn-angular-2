import { Routes } from '@angular/router';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { ResetPasswordSuccessComponent } from './reset-password-success/reset-password-success.component';
import { SignInComponent } from './sign-in/sign-in.component';

export const AuthRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'sign-in',
        component: SignInComponent,
      },
      {
        path: 'forgot-password',
        component: ForgotPasswordComponent,
      },
      {
        path: 'reset-password-success',
        component: ResetPasswordSuccessComponent,
      },
    ],
  },
];
