import { Routes } from '@angular/router';
import { IntroduceComponent } from './general/introduce/introduce.component';
import { CompaniesListComponent } from './general/companies-list/companies-list.component';
import { AuthGuardService as AuthGuard } from './../../core/services/auth-guard.service';
import { EkycComponent } from './hmg/ekyc/ekyc.component';
import { ConfirmInformationComponent } from './hmg/confirm-information/confirm-information.component';
import { SignContractTermsOfServiceComponent } from './hmg/sign-contract-terms-of-service/sign-contract-terms-of-service.component';
import { SignContractTermsSuccessComponent } from './hmg/sign-contract-terms-success/sign-contract-terms-success.component';
import { AdditionalInformationComponent } from './hmg/additional-information/additional-information.component';
import { LoanDeterminationComponent } from './hmg/loan-determination/loan-determination.component';
import { CurrentLoanComponent } from './hmg/current-loan/current-loan.component';
import { SignContractComponent } from './hmg/sign-contract/sign-contract.component';
import { SignContractSuccessComponent } from './hmg/sign-contract-success/sign-contract-success.component';
import { LoanPaymentComponent } from './hmg/loan-payment/loan-payment.component';
import { PlChoosePaymentMethodComponent } from './hmg/pl-choose-payment-method/pl-choose-payment-method.component';
import { GpayPaymentResultComponent } from './hmg/gpay-payment-result/gpay-payment-result.component';

export const PaydayLoanRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'introduce',
        component: IntroduceComponent,
        data: { animation: true },
      },
      {
        path: 'companies',
        component: CompaniesListComponent,
        data: { animation: true },
        canActivate: [AuthGuard],
      },
      {
        path: 'ekyc',
        component: EkycComponent,
        data: { animation: true },
        canActivate: [AuthGuard],
      },
      {
        path: 'confirm-information',
        component: ConfirmInformationComponent,
        data: { animation: true },
        canActivate: [AuthGuard],
      },
      {
        path: 'sign-approval-letter',
        component: SignContractTermsOfServiceComponent,
        data: { animation: true },
        canActivate: [AuthGuard],
      },
      {
        path: 'sign-approval-letter-success',
        component: SignContractTermsSuccessComponent,
        data: { animation: true },
        canActivate: [AuthGuard],
      },
      {
        path: 'additional-information',
        component: AdditionalInformationComponent,
        data: { animation: true },
        canActivate: [AuthGuard],
      },
      {
        path: 'loan-determination',
        component: LoanDeterminationComponent,
        data: { animation: true },
        canActivate: [AuthGuard],
      },
      {
        path: 'current-loan/:status',
        component: CurrentLoanComponent,
        data: { animation: true },
        canActivate: [AuthGuard],
      },
      {
        path: 'sign-contract',
        component: SignContractComponent,
        data: { animation: true },
        canActivate: [AuthGuard],
      },
      {
        path: 'sign-contract-success',
        component: SignContractSuccessComponent,
        data: { animation: true },
        canActivate: [AuthGuard],
      },
      {
        path: 'loan-payment',
        component: LoanPaymentComponent,
        data: { animation: true },
        canActivate: [AuthGuard],
      },
      {
        path: 'choose-payment-method',
        component: PlChoosePaymentMethodComponent,
        data: { animation: true },
        canActivate: [AuthGuard],
      },
      {
        path: 'payment/callback',
        component: GpayPaymentResultComponent,
        data: { animation: true },
      },
    ],
  },
];
