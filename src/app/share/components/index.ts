import {StepProgressBarComponent} from './progress-bar/step-progress-bar/step-progress-bar.component';
import {ConfirmationDialog} from "./confirmation-dialog/confirmation-dialog.component";
import {CardPaymentComponent} from "./payment/card-payment/card-payment.component";
import {ChoosePaymentMethodComponent} from "./payment/choose-payment-method/choose-payment-method.component";
import {SwitchTabPaymentMethodComponent} from "./payment/switch-tab-payment-method/switch-tab-payment-method.component";
import {TransferPaymentComponent} from "./payment/transfer-payment/transfer-payment.component";
import { ShowErrorsComponent } from './show-errors/show-errors.component';

export const components: any[] = [
  StepProgressBarComponent,
  ConfirmationDialog,
  CardPaymentComponent,
  ChoosePaymentMethodComponent,
  SwitchTabPaymentMethodComponent,
  TransferPaymentComponent,
  ShowErrorsComponent
];

export * from './progress-bar/step-progress-bar/step-progress-bar.component';
export * from "./confirmation-dialog/confirmation-dialog.component";
export * from "./payment/card-payment/card-payment.component";
export * from "./payment/choose-payment-method/choose-payment-method.component";
export * from "./payment/switch-tab-payment-method/switch-tab-payment-method.component";
export * from "./payment/transfer-payment/transfer-payment.component";
export * from './show-errors/show-errors.component';

