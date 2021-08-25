import {Action} from '@ngrx/store';

export const GET_CUSTOMER_INFO = '[Customer] get customer info';
export const GET_CUSTOMER_INFO_ERROR = '[Customer] get customer info error';
export const GET_CUSTOMER_INFO_SUCCESS = '[Customer] get customer info success';

export class GetCustomerInfo implements Action {
    readonly type = GET_CUSTOMER_INFO;

    constructor(public payload: any) {
    }
}

export class GetCustomerInfoError implements Action {
    readonly type = GET_CUSTOMER_INFO_ERROR;

    constructor(public payload: any) {
    }
}

export class GetCustomerInfoSuccess implements Action {
    readonly type = GET_CUSTOMER_INFO_SUCCESS;

    constructor(public payload: any) {
    }
}

export type CustomerActions =
    | GetCustomerInfoError
    | GetCustomerInfoSuccess
    | GetCustomerInfo;
