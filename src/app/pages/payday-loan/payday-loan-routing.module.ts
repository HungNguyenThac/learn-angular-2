import {Routes} from '@angular/router';
import {IntroduceComponent} from "./general/introduce/introduce.component";
import {CompaniesListComponent} from "./general/companies-list/companies-list.component";

export const PaydayLoanRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'introduce',
        component: IntroduceComponent,
        data: {animation: true},
      },
      {
        path: 'companies',
        component: CompaniesListComponent,
        data: {animation: true},
      },
      {
        path: 'hmg',
        loadChildren: () => import('./hmg/hmg.module').then(m => m.HmgModule)
      }
    ],
  },
];
