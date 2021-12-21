import { Routes } from '@angular/router';
import { SignInComponent } from './sign-in/sign-in.component';

export const AuthRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'sign-in',
        component: SignInComponent,
        data: { animation: true },
      },
      // {
      //   path: 'forgot-password',
      //   component: ForgotPasswordComponent,
      // },
      // {
      //   path: 'reset-password-success',
      //   component: ResetPasswordSuccessComponent,
      // },
    ],
  },
];
