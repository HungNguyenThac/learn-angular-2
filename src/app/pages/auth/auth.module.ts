import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthRoutes } from './auth-routing.module';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { MaterialModule } from 'src/app/share/modules/material.modules';
import { SignInComponent } from './sign-in/sign-in.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { SharedModule } from 'src/app/share/shared.module';
import { ResetPasswordSuccessComponent } from './reset-password-success/reset-password-success.component';
import { PlAuthSuccessComponent } from './components/pl-auth-success/pl-auth-success.component';

@NgModule({
  declarations: [
    SignInComponent,
    ForgotPasswordComponent,
    ResetPasswordSuccessComponent,
    PlAuthSuccessComponent,
  ],
  imports: [
    MaterialModule,
    CommonModule,
    TranslateModule,
    SharedModule,
    RouterModule.forChild(AuthRoutes),
    ReactiveFormsModule,
    FormsModule,
  ],
})
export class AuthModule {}
