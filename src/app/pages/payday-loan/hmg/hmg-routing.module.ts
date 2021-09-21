import {Routes} from '@angular/router';
import {LoanDeterminationComponent} from './loan-determination/loan-determination.component';
import {SignContractSuccessComponent} from "./sign-contract-success/sign-contract-success.component";
import {EkycComponent} from "./ekyc/ekyc.component";
import {CurrentLoanComponent} from "./current-loan/current-loan.component";
import {SignContractTermsSuccessComponent} from "./sign-contract-terms-success/sign-contract-terms-success.component";
import {ContractTermsOfServiceComponent} from "./contract-terms-of-service/contract-terms-of-service.component";
import {ConfirmInformationComponent} from "./confirm-information/confirm-information.component";
import {AdditionalInformationComponent} from "./additional-information/additional-information.component";

export const HmgRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'ekyc',
        component: EkycComponent,
        data: {animation: true},
      },
      {
        path: 'confirm-information',
        component: ConfirmInformationComponent,
        data: {animation: true},
      },
      {
        path: 'contract-terms-of-service',
        component: ContractTermsOfServiceComponent,
        data: {animation: true},
      },
      {
        path: 'sign-contract-terms-success',
        component: SignContractTermsSuccessComponent,
        data: {animation: true},
      },
      {
        path: 'additional-information',
        component: AdditionalInformationComponent,
        data: {animation: true},
      },
      {
        path: 'loan-determination',
        component: LoanDeterminationComponent,
        data: {animation: true},
      },
      {
        path: 'current-loan/:status',
        component: CurrentLoanComponent,
        data: {animation: true},
      },
      {
        path: 'sign-contract-success',
        component: SignContractSuccessComponent,
        data: {animation: true},
      }
    ],
  },
];
