import { Routes } from '@angular/router';
import { CompaniesListComponent } from './companies-list/companies-list.component';
import { IntroduceComponent } from './introduce/introduce.component';

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
    ],
  },
];
