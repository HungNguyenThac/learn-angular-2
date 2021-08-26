import { Routes } from '@angular/router';
import { DetermineNeedsComponent } from './determine-needs/determine-needs.component';
import { InsuranceProductsChoicesComponent } from './insurance-products-choices/insurance-products-choices.component';

export const InsuranceRoutes: Routes = [
  {
    path: '',
    component: DetermineNeedsComponent,
    children: [
      {
        path: '',
        component: DetermineNeedsComponent,
      },
      {
        path: 'insurance-choices',
        component: InsuranceProductsChoicesComponent,
      },
    ],
  },
];
