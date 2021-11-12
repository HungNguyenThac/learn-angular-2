export * from './contractController.service';
import { ContractControllerService } from './contractController.service';
export * from './letterController.service';
import { LetterControllerService } from './letterController.service';
export * from './signDocumentController.service';
import { SignDocumentControllerService } from './signDocumentController.service';
export * from './signingPositionController.service';
import { SigningPositionControllerService } from './signingPositionController.service';
export const APIS = [ContractControllerService, LetterControllerService, SignDocumentControllerService, SigningPositionControllerService];
