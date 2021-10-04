import { Action } from '@ngrx/store';

export const GET_CUSTOMER_INFO = '[Customer] get customer info';
export const GET_CUSTOMER_INFO_ERROR = '[Customer] get customer info error';
export const GET_CUSTOMER_INFO_SUCCESS = '[Customer] get customer info success';
export const SET_CUSTOMER_INFO = '[Customer] set customer info';
export const RESET_CUSTOMER_INFO = '[Customer] reset customer info';
export const GET_RATING_INFO = '[Customer] get rating info';
export const GET_RATING_INFO_SUCCESS = '[Customer] get rating info success';
export const GET_RATING_INFO_ERROR = '[Customer] get rating info error';
export const SET_RATING_INFO = '[Customer] set rating info';
export const RESET_RATING_INFO = '[Customer] reset rating info';

export class GetCustomerInfo implements Action {
  readonly type = GET_CUSTOMER_INFO;

  constructor(public payload: any) {}
}

export class GetCustomerInfoError implements Action {
  readonly type = GET_CUSTOMER_INFO_ERROR;

  constructor(public payload?: any) {}
}

export class GetCustomerInfoSuccess implements Action {
  readonly type = GET_CUSTOMER_INFO_SUCCESS;

  constructor(public payload: any) {}
}

export class SetCustomerInfo implements Action {
  readonly type = SET_CUSTOMER_INFO;

  constructor(public payload: any) {}
}

export class ResetCustomerInfo implements Action {
  readonly type = RESET_CUSTOMER_INFO;

  constructor(public payload?: any) {}
}

export class SetRatingInfo implements Action {
  readonly type = SET_RATING_INFO;

  constructor(public payload?: any) {}
}

export class GetRatingInfo implements Action {
  readonly type = GET_RATING_INFO;

  constructor(public payload?: any) {}
}

export class GetRatingInfoSuccess implements Action {
  readonly type = GET_RATING_INFO_SUCCESS;

  constructor(public payload?: any) {}
}

export class GetRatingInfoError implements Action {
  readonly type = GET_RATING_INFO_ERROR;

  constructor(public payload?: any) {}
}

export class ResetRatingInfo implements Action {
  readonly type = RESET_RATING_INFO;

  constructor(public payload?: any) {}
}

export type CustomerActions =
  | GetCustomerInfoError
  | GetCustomerInfoSuccess
  | GetCustomerInfo
  | SetCustomerInfo
  | ResetCustomerInfo
  | SetRatingInfo
  | ResetRatingInfo
  | GetRatingInfo
  | GetRatingInfoSuccess
  | GetRatingInfoError;
