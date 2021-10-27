import * as fromActions from '../actions';
import { NAV_ITEM } from '../../common/enum/operator';

export interface OperatorState {
  activeNavItem: NAV_ITEM;
}

export const OPERATOR_INITIAL_STATE: OperatorState = {
  activeNavItem: NAV_ITEM.DASHBOARD
};

class OperatorActions {
  constructor(
    private state: OperatorState,
    private action: fromActions.OperatorActions
  ) {}

  setActiveNavItem() {
    const payload = this.action.payload;

    return { ...this.state, activeNavItem: payload };
  }

  resetActiveNavItem() {
    return { ...this.state, activeNavItem: NAV_ITEM.DASHBOARD };
  }
}

export function operatorReducer(
  state: OperatorState = OPERATOR_INITIAL_STATE,
  action: fromActions.OperatorActions
): OperatorState {
  const operatorActions: OperatorActions = new OperatorActions(state, action);

  switch (action.type) {
    case fromActions.SET_ACTIVE_NAV_ITEM: {
      return operatorActions.setActiveNavItem();
    }

    case fromActions.RESET_ACTIVE_NAV_ITEM: {
      return operatorActions.resetActiveNavItem();
    }

    default: {
      return state;
    }
  }
}
