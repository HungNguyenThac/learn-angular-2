export * from './applicationController.service';
import { ApplicationControllerService } from './applicationController.service';
export * from './contractController.service';
import { ContractControllerService } from './contractController.service';
export * from './paydayLoanController.service';
import { PaydayLoanControllerService } from './paydayLoanController.service';
export * from './promotionController.service';
import { PromotionControllerService } from './promotionController.service';
export const APIS = [ApplicationControllerService, ContractControllerService, PaydayLoanControllerService, PromotionControllerService];
