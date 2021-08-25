import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {AuthRoutes} from './auth-routing.module';
import {RouterModule} from '@angular/router';
import {ReactiveFormsModule} from '@angular/forms';
import {TranslateModule} from "@ngx-translate/core";


@NgModule({
    declarations: [
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
