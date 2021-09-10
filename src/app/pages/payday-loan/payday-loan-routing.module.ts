import { Routes } from '@angular/router';
import {ContractTermsOfServiceComponent} from "./contract-terms-of-service/contract-terms-of-service.component";
import { SignContractSuccessComponent } from './sign-contract-success/sign-contract-success.component';
import {SignContractTermsSuccessComponent} from "./sign-contract-terms-success/sign-contract-terms-success.component";
import {EkycComponent} from "./ekyc/ekyc.component";
import {CurrentLoanComponent} from "./current-loan/current-loan.component";

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
      {
        path: 'sign-contract-success',
        component: SignContractSuccessComponent,
        data: { animation: true },
      },
      {
        path: 'ekyc',
        component: EkycComponent,
        data: { animation: true },
      },
      {
        path: 'current-loan',
        component: CurrentLoanComponent,
        data: { animation: true },
      },
    ],
  },
];
