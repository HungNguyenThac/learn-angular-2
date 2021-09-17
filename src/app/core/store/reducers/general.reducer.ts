import * as fromActions from '../actions';

export interface GeneralState {
  promptInfo: any;
}

export const GENERAL_INITIAL_STATE: GeneralState = {
  promptInfo: null,
};

class GeneralActions {
  constructor(
    private state: GeneralState,
    private action: fromActions.GeneralActions
  ) {}

  showErrorModal() {
    const payload = this.action.payload;

    return { ...this.state, promptInfo: payload };
  }

  showSuccessModal() {
    const payload = this.action.payload;

    return { ...this.state, promptInfo: payload };
  }
}

export function generalReducer(
  state: GeneralState = GENERAL_INITIAL_STATE,
  action: fromActions.GeneralActions
): GeneralState {
  const generalActions: GeneralActions = new GeneralActions(state, action);

  switch (action.type) {
    case fromActions.SHOW_ERROR_MODAL:
      return generalActions.showErrorModal();
    case fromActions.SHOW_SUCCESS_MODAL:
      return generalActions.showSuccessModal();
    default: {
      return state;
    }
  }
}
