import { Routes } from '@angular/router';
import { DetermineNeedsComponent } from './determine-needs/determine-needs.component';
import { ChargeInsuranceComponent } from './charge-insurance/charge-insurance.component';
import { InsuranceProductsChoicesComponent } from './insurance-products-choices/insurance-products-choices.component';

export const InsuranceRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        children: [
          {
            path: '',
            component: DetermineNeedsComponent,
            data: { animation: true },
          },
          {
            path: 'charge-insurance',
            component: ChargeInsuranceComponent,
            data: { animation: true },
          },
          {
            path: 'insurance-choices',
            component: InsuranceProductsChoicesComponent,
            data: { animation: true },
          },
        ],
      },
    ],
  },
];
