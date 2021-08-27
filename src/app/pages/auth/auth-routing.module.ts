import {Routes} from '@angular/router';
import { LoginComponent } from './login/login.component';

const moduleBaseFolder = '../auth';

export const AuthRoutes: Routes = [
    {
        path: '',
        children: [
            {
                path: 'login',
                component: LoginComponent
            }
        ]
    }
]
