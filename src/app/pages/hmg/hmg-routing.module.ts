import { Routes } from '@angular/router';
import { AdditionalUserInfoComponent } from './additional-user-info/additional-user-info.component';
import { ApprovalLetterSignComponent } from './approval-letter-sign/approval-letter-sign.component';
import { CompaniesListComponent } from './companies-list/companies-list.component';
import { DetailContractSignComponent } from './detail-contract-sign/detail-contract-sign.component';
import { IntroduceComponent } from './introduce/introduce.component';
import { UserInfoFormComponent } from './user-info-form/user-info-form.component';

export const HmgRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        component: IntroduceComponent,
        data: { animation: true },
      },
      {
        path: 'introduce',
        component: IntroduceComponent,
        data: { animation: true },
      },
      {
        path: 'companies',
        component: CompaniesListComponent,
        data: { animation: true },
      },
      {
        path: 'user-info',
        component: UserInfoFormComponent,
        data: { animation: true },
      },
      {
        path: 'approval-letter',
        component: ApprovalLetterSignComponent,
        data: { animation: true },
      },
      {
        path: 'additional-user-info',
        component: AdditionalUserInfoComponent,
        data: { animation: true },
      },
      {
        path: 'detail-contract',
        component: DetailContractSignComponent,
        data: { animation: true },
      },
    ],
  },
];
