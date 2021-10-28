import { ConfirmationDialog } from './dialogs/confirmation-dialog/confirmation-dialog.component';
import { CardPaymentComponent } from './payment/card-payment/card-payment.component';
import { ChoosePaymentMethodComponent } from './payment/choose-payment-method/choose-payment-method.component';
import { SwitchTabPaymentMethodComponent } from './payment/switch-tab-payment-method/switch-tab-payment-method.component';
import { TransferPaymentComponent } from './payment/transfer-payment/transfer-payment.component';
import { ShowErrorsComponent } from './show-errors/show-errors.component';
import { PlPromptComponent } from './dialogs/pl-prompt/pl-prompt.component';
import { OtpInputComponent } from './inputs/otp-input/otp-input.component';
import { SingleOtpInputComponent } from './inputs/single-otp-input/single-otp-input.component';
import { PlLoadingComponent } from './dialogs/pl-loading/pl-loading.component';
import { GuideTransferPaymentDialogComponent } from './payment/guide-transfer-payment-dialog/guide-transfer-payment-dialog.component';
import { BaseManagementLayoutComponent } from './base/base-management-layout/base-management-layout.component';
import { BaseFilterFormComponent } from './base/base-filter-form/base-filter-form.component';
import { BaseExpandedTableComponent } from './base/base-expanded-table/base-expanded-table.component';
import { BaseBreadcrumbComponent } from './base/base-breadcrumb/base-breadcrumb.component';
import { PlInlineMessageComponent } from './statutes/pl-inline-message/pl-inline-message.component';
import { PlStatusLabelComponent } from './statutes/pl-status-label/pl-status-label.component';
import { DocumentButtonComponent } from './button/document-button/document-button.component';
import { UploadDocumentAreaComponent } from './upload-area/upload-document-area/upload-document-area.component';
import { PlStatusElementComponent } from './statutes/pl-status-element/pl-status-element.component';

export const components: any[] = [
  ConfirmationDialog,
  CardPaymentComponent,
  ChoosePaymentMethodComponent,
  SwitchTabPaymentMethodComponent,
  TransferPaymentComponent,
  ShowErrorsComponent,
  OtpInputComponent,
  SingleOtpInputComponent,
  PlPromptComponent,
  PlLoadingComponent,
  GuideTransferPaymentDialogComponent,
  PlInlineMessageComponent,
  PlStatusLabelComponent,
  BaseManagementLayoutComponent,
  BaseFilterFormComponent,
  BaseExpandedTableComponent,
  BaseBreadcrumbComponent,
  DocumentButtonComponent,
  UploadDocumentAreaComponent,
  PlStatusElementComponent,
];

export * from './dialogs/confirmation-dialog/confirmation-dialog.component';
export * from './payment/card-payment/card-payment.component';
export * from './payment/choose-payment-method/choose-payment-method.component';
export * from './payment/switch-tab-payment-method/switch-tab-payment-method.component';
export * from './payment/transfer-payment/transfer-payment.component';
export * from './show-errors/show-errors.component';
export * from './dialogs/pl-prompt/pl-prompt.component';
export * from './inputs/otp-input/otp-input.component';
export * from './inputs/single-otp-input/single-otp-input.component';
export * from './dialogs/pl-loading/pl-loading.component';
export * from './payment/guide-transfer-payment-dialog/guide-transfer-payment-dialog.component';
export * from './base/base-management-layout/base-management-layout.component';
export * from './base/base-filter-form/base-filter-form.component';
export * from './base/base-expanded-table/base-expanded-table.component';
export * from './base/base-breadcrumb/base-breadcrumb.component';
export * from './statutes/pl-inline-message/pl-inline-message.component';
export * from './statutes/pl-status-label/pl-status-label.component';
export * from './button/document-button/document-button.component';
export * from './upload-area/upload-document-area/upload-document-area.component';
export * from './statutes/pl-status-element/pl-status-element.component';
