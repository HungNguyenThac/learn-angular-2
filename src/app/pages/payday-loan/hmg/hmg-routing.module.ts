import { Routes } from '@angular/router';
import { LoanDeterminationComponent } from './loan-determination/loan-determination.component';
import { SignContractSuccessComponent } from './sign-contract-success/sign-contract-success.component';
import { EkycComponent } from './ekyc/ekyc.component';
import { CurrentLoanComponent } from './current-loan/current-loan.component';
import { SignContractTermsSuccessComponent } from './sign-contract-terms-success/sign-contract-terms-success.component';
import { SignContractTermsOfServiceComponent } from './sign-contract-terms-of-service/sign-contract-terms-of-service.component';
import { ConfirmInformationComponent } from './confirm-information/confirm-information.component';
import { AdditionalInformationComponent } from './additional-information/additional-information.component';
import { PlChoosePaymentMethodComponent } from './pl-choose-payment-method/pl-choose-payment-method.component';
import { LoanPaymentComponent } from './loan-payment/loan-payment.component';
import { GpayPaymentResultComponent } from './gpay-payment-result/gpay-payment-result.component';
import { SignContractComponent } from './sign-contract/sign-contract.component';
import {NotFoundComponent} from "../../errors/not-found/not-found.component";

export const HmgRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'ekyc',
        component: EkycComponent,
        data: { animation: true },
      },
      {
        path: 'confirm-information',
        component: ConfirmInformationComponent,
        data: { animation: true },
      },
      {
        path: 'sign-contract-terms-of-service',
        component: SignContractTermsOfServiceComponent,
        data: { animation: true },
      },
      {
        path: 'sign-contract-terms-success',
        component: SignContractTermsSuccessComponent,
        data: { animation: true },
      },
      {
        path: 'additional-information',
        component: AdditionalInformationComponent,
        data: { animation: true },
      },
      {
        path: 'loan-determination',
        component: LoanDeterminationComponent,
        data: { animation: true },
      },
      {
        path: 'current-loan/:status',
        component: CurrentLoanComponent,
        data: { animation: true },
      },
      {
        path: 'sign-contract',
        component: SignContractComponent,
        data: { animation: true },
      },
      {
        path: 'sign-contract-success',
        component: SignContractSuccessComponent,
        data: { animation: true },
      },
      {
        path: 'loan-payment',
        component: LoanPaymentComponent,
        data: { animation: true },
      },
      {
        path: 'choose-payment-method',
        component: PlChoosePaymentMethodComponent,
        data: { animation: true },
      },
      {
        path: 'callback',
        component: GpayPaymentResultComponent,
        data: { animation: true },
      }
    ],
  },
];
