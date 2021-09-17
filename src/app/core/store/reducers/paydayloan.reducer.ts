import * as fromActions from '../actions';
import {KalapaResponse} from "../../../../../open-api-modules/customer-api-docs";

export interface PaydayLoanState {
  ekycInfo: KalapaResponse;
}

export const PAYDAY_LOAN_INITIAL_STATE: PaydayLoanState = {
  ekycInfo: null,
};

class PaydayLoanActions {
  constructor(
    private state: PaydayLoanState,
    private action: fromActions.PaydayLoanActions
  ) {}

  setEkycInfo() {
    const payload = this.action.payload;

    return { ...this.state, ekycInfo: payload };
  }

  resetEkycInfo() {
    const payload = this.action.payload;

    return { ...this.state, ekycInfo: payload };
  }
}

export function paydayLoanReducer(
  state: PaydayLoanState = PAYDAY_LOAN_INITIAL_STATE,
  action: fromActions.PaydayLoanActions
): PaydayLoanState {
  const paydayLoanActions: PaydayLoanActions = new PaydayLoanActions(
    state,
    action
  );

  switch (action.type) {
    case fromActions.SET_EKYC_INFO:
      return paydayLoanActions.setEkycInfo();
    case fromActions.RESET_EKYC_INFO:
      return paydayLoanActions.resetEkycInfo();
    default: {
      return state;
    }
  }
}
