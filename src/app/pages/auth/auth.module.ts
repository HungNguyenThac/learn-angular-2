import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthRoutes } from './auth-routing.module';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { LoginComponent } from './login/login.component';
import { MaterialModule } from 'src/app/modules/material.modules';
import { SignUpComponent } from './sign-up/sign-up.component';

@NgModule({
  declarations: [LoginComponent, SignUpComponent],
  imports: [
    MaterialModule,
    CommonModule,
    RouterModule.forChild(AuthRoutes),
    ReactiveFormsModule,
    TranslateModule,
  ],
})
export class AuthModule {}
