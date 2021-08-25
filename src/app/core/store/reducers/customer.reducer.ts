import * as fromActions from '../actions';
import {HttpErrorResponse} from "@angular/common/http";
import {Customer} from "../../../public/models";

export interface CustomerState {
    customerInfo: any;
    loginError: HttpErrorResponse;
}

export const CUSTOMER_INITIAL_STATE: CustomerState = {
    customerInfo: null,
    loginError: null
}

class CustomerActions {

    constructor(private state: CustomerState, private action: fromActions.CustomerActions) {
    }

    getCustomerInfo() {
        const payload = this.action.payload;

        return {...this.state};

    }

    getCustomerInfoSuccess() {
        if (!this.action.payload || !this.action.payload.responseCode || this.action.payload.responseCode !== 200) return this.state;
        const payload: Customer = this.action.payload.result;
        return {
            ...this.state,
            customerInfo: payload,
            loginProcess: null,
            loginError: null
        }

    }

    getCustomerInfoError() {
        const payload: HttpErrorResponse = this.action.payload;
        return {...this.state, loginError: payload};
    }
}

export function customerReducer(state: CustomerState = CUSTOMER_INITIAL_STATE, action: fromActions.CustomerActions): CustomerState {

    const customerActions: CustomerActions = new CustomerActions(state, action);

    switch (action.type) {
        case fromActions.GET_CUSTOMER_INFO: {
            return customerActions.getCustomerInfo();
        }

        case fromActions.GET_CUSTOMER_INFO_SUCCESS: {
            return customerActions.getCustomerInfoSuccess();
        }

        case fromActions.GET_CUSTOMER_INFO_ERROR: {
            return customerActions.getCustomerInfoError();
        }

        default: {
            return state;
        }
    }
}
