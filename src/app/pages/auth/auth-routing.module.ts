import {Routes} from '@angular/router';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { LoginComponent } from './login/login.component';
import { SignInComponent } from './sign-in/sign-in.component';
import { SignUpSuccessComponent } from './sign-up-success/sign-up-success.component';
import { SignUpComponent } from './sign-up/sign-up.component';

const moduleBaseFolder = '../auth';

export const AuthRoutes: Routes = [
    {
        path: '',
        children: [
            {
                path: 'login',
                component: LoginComponent
            },
            {
                path: 'sign-up',
                component: SignUpComponent
            },
            {
                path: 'sign-in',
                component: SignInComponent
            },
            {
                path: 'forgot-password',
                component: ForgotPasswordComponent,
            },
            {
                path: 'sign-up-success',
                component: SignUpSuccessComponent
            },
        ]
    }
]
