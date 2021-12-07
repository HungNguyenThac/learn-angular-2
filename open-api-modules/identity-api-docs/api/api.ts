export * from './adminAccountController.service';
import { AdminAccountControllerService } from './adminAccountController.service';
export * from './customerController.service';
import { CustomerControllerService } from './customerController.service';
export * from './groupController.service';
import { GroupControllerService } from './groupController.service';
export * from './permissionController.service';
import { PermissionControllerService } from './permissionController.service';
export * from './permissionTypeController.service';
import { PermissionTypeControllerService } from './permissionTypeController.service';
export * from './signOnController.service';
import { SignOnControllerService } from './signOnController.service';
export const APIS = [AdminAccountControllerService, CustomerControllerService, GroupControllerService, PermissionControllerService, PermissionTypeControllerService, SignOnControllerService];
