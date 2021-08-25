export * from './serviceCredentialController.service';
import { ServiceCredentialControllerService } from './serviceCredentialController.service';
export * from './signOnController.service';
import { SignOnControllerService } from './signOnController.service';
export const APIS = [ServiceCredentialControllerService, SignOnControllerService];
