import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthRoutes } from './auth-routing.module';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { LoginComponent } from './login/login.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { MaterialModule } from 'src/app/share/modules/material.modules';
import { SignInComponent } from './sign-in/sign-in.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';

@NgModule({
  declarations: [LoginComponent, SignUpComponent, SignInComponent, ForgotPasswordComponent],
  imports: [
    MaterialModule,
    CommonModule,
    RouterModule.forChild(AuthRoutes),
    ReactiveFormsModule,
    TranslateModule,
  ],
})
export class AuthModule {}
