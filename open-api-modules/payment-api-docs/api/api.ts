export * from './checkConnectController.service';
import { CheckConnectControllerService } from './checkConnectController.service';
export * from './disburseController.service';
import { DisburseControllerService } from './disburseController.service';
export * from './gpayVirtualAccountController.service';
import { GpayVirtualAccountControllerService } from './gpayVirtualAccountController.service';
export * from './repaymentController.service';
import { RepaymentControllerService } from './repaymentController.service';
export const APIS = [CheckConnectControllerService, DisburseControllerService, GpayVirtualAccountControllerService, RepaymentControllerService];
