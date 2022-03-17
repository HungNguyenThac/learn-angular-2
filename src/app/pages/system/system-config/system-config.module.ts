import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfigDocumentListComponent } from './config-document/config-document-list/config-document-list.component';
import { ConfigContractListComponent } from './config-contract/config-contract-list/config-contract-list.component';
import { RouterModule, Routes } from '@angular/router';
import { NgxPermissionsGuard } from 'ngx-permissions';
import { SharedModule } from '../../../share/shared.module';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';
import { TitleConstants } from '../../../core/common/providers/title-constants';
import { ApplicationDocumentSaveDialogComponent } from './config-document/components/application-document-save-dialog/application-document-save-dialog.component';
import { DocumentTypeListComponent } from './config-document/document-type-list/document-type-list.component';
import { DocumentTypeSaveDialogComponent } from './config-document/components/document-type-save-dialog/document-type-save-dialog.component';

export const SystemConfigRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'document',
        component: ConfigDocumentListComponent,
        canActivateChild: [NgxPermissionsGuard],
        data: {
          title: TitleConstants.TITLE_VALUE.CONFIG_DOCUMENT_LIST,
          animation: true,
          permissions: {
            only: [''],
            redirectTo: '/',
          },
        },
      },
      {
        path: 'document-type',
        component: DocumentTypeListComponent,
        canActivateChild: [NgxPermissionsGuard],
        data: {
          title: TitleConstants.TITLE_VALUE.CONFIG_DOCUMENT_TYPE_LIST,
          animation: true,
          permissions: {
            only: [''],
            redirectTo: '/',
          },
        },
      },
      {
        path: 'contract',
        component: ConfigContractListComponent,
        canActivateChild: [NgxPermissionsGuard],
        data: {
          title: TitleConstants.TITLE_VALUE.CONFIG_CONTRACT_LIST,
          animation: true,
          permissions: {
            only: [''],
            redirectTo: '/',
          },
        },
      },
    ],
  },
];

@NgModule({
  declarations: [
    ConfigDocumentListComponent,
    ConfigContractListComponent,
    ApplicationDocumentSaveDialogComponent,
    DocumentTypeListComponent,
    DocumentTypeSaveDialogComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(SystemConfigRoutes),
    SharedModule,
    TranslateModule,
    FormsModule,
  ],
})
export class SystemConfigModule {}
