import { Routes } from '@angular/router';
import {ContractTermsOfServiceComponent} from "./contract-terms-of-service/contract-terms-of-service.component";
import {SignContractTermsSuccessComponent} from "./sign-contract-terms-success/sign-contract-terms-success.component";

export const PaydayLoanRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'contract-terms-of-service',
        component: ContractTermsOfServiceComponent,
        data: { animation: true },
      },
      {
        path: 'sign-contract-terms-success',
        component: SignContractTermsSuccessComponent,
        data: { animation: true },
      },
    ],
  },
];
