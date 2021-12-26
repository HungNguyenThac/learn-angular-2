import { HiddenDirective } from './hidden.directive';
import { NumberOnlyDirective } from './number-only.directive';
import { PhoneNumberOnlyDirective } from './phone-number-only.directive';
import { ResizeColumnDirective } from './resize-column.directive';

export const directives: any[] = [
  HiddenDirective,
  NumberOnlyDirective,
  PhoneNumberOnlyDirective,
  ResizeColumnDirective,
];

export * from './hidden.directive';
export * from './number-only.directive';
export * from './phone-number-only.directive';
export * from './resize-column.directive';
