import { SET_RATING_INFO } from './../actions/customer.actions';
import { Rating } from './../../../../../open-api-modules/customer-api-docs/model/rating';
import * as fromActions from '../actions';
import { HttpErrorResponse } from '@angular/common/http';
import { CustomerInfoResponse } from '../../../../../open-api-modules/customer-api-docs';

export interface CustomerState {
  customerInfo: CustomerInfoResponse;
  getCustomerError: HttpErrorResponse;
  rateInfo: Rating;
}

export const CUSTOMER_INITIAL_STATE: CustomerState = {
  customerInfo: null,
  getCustomerError: null,
  rateInfo: null,
};

class CustomerActions {
  constructor(
    private state: CustomerState,
    private action: fromActions.CustomerActions
  ) {}

  getCustomerInfo() {
    const payload = this.action.payload;

    return { ...this.state };
  }

  setCustomerInfo() {
    const payload = this.action.payload;

    return { ...this.state, customerInfo: payload };
  }

  resetCustomerInfo() {
    return { ...this.state, customerInfo: null };
  }

  getCustomerInfoSuccess() {
    const payload = this.action.payload;

    if (!payload || !payload.responseCode || payload.responseCode !== 200)
      return this.state;
    return {
      ...this.state,
      customerInfo: payload.result,
      getCustomerError: null,
    };
  }

  getCustomerInfoError() {
    const payload = this.action.payload;
    return { ...this.state, getCustomerError: payload };
  }

  rating() {
    const payload = this.action.payload;
    return { ...this.state, rateInfo: payload}
  }
}

export function customerReducer(
  state: CustomerState = CUSTOMER_INITIAL_STATE,
  action: fromActions.CustomerActions
): CustomerState {
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

    case fromActions.SET_CUSTOMER_INFO: {
      return customerActions.setCustomerInfo();
    }

    case fromActions.RESET_CUSTOMER_INFO: {
      return customerActions.resetCustomerInfo();
    }

    case fromActions.SET_RATING_INFO: {
      return customerActions.rating();
    }

    default: {
      return state;
    }
  }
}
