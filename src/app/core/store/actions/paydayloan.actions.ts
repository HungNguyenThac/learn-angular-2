import { Action } from '@ngrx/store';
import {IdCardInfo} from "../../../../../open-api-modules/customer-api-docs";

export const SET_EKYC_INFO = '[EKYC] Set ekyc info';
export const RESET_EKYC_INFO = '[EKYC] Reset ekyc info';

export class SetEkycInfo implements Action {
  readonly type = SET_EKYC_INFO;

  constructor(public payload: IdCardInfo) {}
}

export class ResetEkycInfo implements Action {
  readonly type = RESET_EKYC_INFO;

  constructor(public payload: any) {}
}

export type PaydayLoanActions = SetEkycInfo | ResetEkycInfo;
