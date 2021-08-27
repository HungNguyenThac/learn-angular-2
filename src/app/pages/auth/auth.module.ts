import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {AuthRoutes} from './auth-routing.module';
import {RouterModule} from '@angular/router';
import {ReactiveFormsModule} from '@angular/forms';
import {TranslateModule} from "@ngx-translate/core";
import { LoginComponent } from './login/login.component';


@NgModule({
    declarations: [
    
    LoginComponent
  ],
    imports: [
        CommonModule,
        RouterModule.forChild(AuthRoutes),
        ReactiveFormsModule,
        TranslateModule,

    ]
})
export class AuthModule {
}
