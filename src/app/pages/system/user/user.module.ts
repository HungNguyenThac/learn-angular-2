import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../../../share/shared.module';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { UserListComponent } from './user-list/user-list.component';
import { UserElementComponent } from './components/user-element/user-element.component';
import { UserDetailComponent } from './components/user-detail/user-detail.component';
import { UserRoleComponent } from './components/user-role/user-role.component';
import { UserTimeLogComponent } from './components/user-time-log/user-time-log.component';

export const UserRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'list',
        component: UserListComponent,
        data: { animation: true },
      },
    ],
  },
];

@NgModule({
  declarations: [UserListComponent, UserElementComponent, UserDetailComponent, UserRoleComponent, UserTimeLogComponent],
  imports: [
    CommonModule,
    CommonModule,
    RouterModule.forChild(UserRoutes),
    SharedModule,
    TranslateModule,
    FormsModule,
    PdfViewerModule,
  ],
})
export class UserModule {}
