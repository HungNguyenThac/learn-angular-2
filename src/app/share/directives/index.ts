import { HiddenDirective } from './hidden.directive';
import { NumberOnlyDirective } from './number-only.directive';
import { PhoneNumberOnlyDirective } from './phone-number-only.directive';
import { ResizeColumnDirective } from './resize-column.directive';
import { PercentageDirective } from './percent.directive';
import { TypeMaxLengthDirective } from './type-max-length.directive';

export const directives: any[] = [
  HiddenDirective,
  NumberOnlyDirective,
  PhoneNumberOnlyDirective,
  ResizeColumnDirective,
  PercentageDirective,
  TypeMaxLengthDirective,
];

export * from './hidden.directive';
export * from './number-only.directive';
export * from './phone-number-only.directive';
export * from './resize-column.directive';
export * from './percent.directive';
export * from './type-max-length.directive';
