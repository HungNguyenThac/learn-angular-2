import {  AgeValidatorDirective } from './age.validator';
import {StrongPasswordValidatorDirective} from "./strong-password.validator";
import {PhoneNumberValidatorDirective} from "./phone-number.validator";

export const validators: any[] = [AgeValidatorDirective,StrongPasswordValidatorDirective,PhoneNumberValidatorDirective];

export * from './age.validator';
export * from './strong-password.validator';
export * from './phone-number.validator';
