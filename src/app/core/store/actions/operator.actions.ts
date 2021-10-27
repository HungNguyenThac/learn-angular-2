import { Action } from '@ngrx/store';
import {NAV_ITEM} from "../../common/enum/operator";

export const SET_ACTIVE_NAV_ITEM = '[Operator] set operator info';
export const RESET_ACTIVE_NAV_ITEM = '[Operator] reset operator info';


export class SetOperatorInfo implements Action {
  readonly type = SET_ACTIVE_NAV_ITEM;

  constructor(public payload: NAV_ITEM) {}
}

export class ResetOperatorInfo implements Action {
  readonly type = RESET_ACTIVE_NAV_ITEM;

  constructor(public payload?: any) {}
}

export type OperatorActions =
  | SetOperatorInfo
  | ResetOperatorInfo;
