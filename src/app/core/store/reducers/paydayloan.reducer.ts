import * as fromActions from '../actions';
import { KalapaResponse } from '../../../../../open-api-modules/customer-api-docs';
import { StepNavigationInfo } from '../../../public/models/step-navigation.model';
import {
  PAYDAY_LOAN_STEP,
  PAYDAY_LOAN_STEP_TITLE,
  PL_STEP_NAVIGATION,
} from '../../common/enum/payday-loan';

export interface PaydayLoanState {
  ekycInfo: KalapaResponse;
  showStepProgressBar: boolean;
  showStepNavigation: boolean;
  showProfileBtn: boolean;
  showLeftBtn: boolean;
  showRightBtn: boolean;
  navigationTitle: string;
  stepNavigationInfo: StepNavigationInfo;
  showNavigationBar: boolean;
}

export const PAYDAY_LOAN_INITIAL_STATE: PaydayLoanState = {
  ekycInfo: null,
  showStepProgressBar: false,
  showStepNavigation: false,
  showProfileBtn: false,
  showLeftBtn: false,
  showRightBtn: false,
  navigationTitle: 'Ứng lương 0% lãi',
  stepNavigationInfo: {
    currentStep: PAYDAY_LOAN_STEP.ELECTRONIC_IDENTIFIERS,
    lastStep: PAYDAY_LOAN_STEP.CONTRACT_SIGNING,
    stepTitle: PAYDAY_LOAN_STEP_TITLE.ELECTRONIC_IDENTIFIERS,
  },
  showNavigationBar: true,
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
    return { ...this.state, ekycInfo: null };
  }

  setShowStepProgressBar() {
    const payload = this.action.payload;

    return { ...this.state, showStepProgressBar: payload };
  }

  setShowStepNavigation() {
    const payload = this.action.payload;

    return { ...this.state, showStepNavigation: payload };
  }

  setStepNavigationInfo() {
    const step: PL_STEP_NAVIGATION = this.action.payload;

    return {
      ...this.state,
      stepNavigationInfo: {
        currentStep: PAYDAY_LOAN_STEP[step],
        lastStep: PAYDAY_LOAN_STEP[step],
        stepTitle: PAYDAY_LOAN_STEP_TITLE[step],
      },
    };
  }

  resetStepNavigationInfo() {
    return {
      ...this.state,
      stepNavigationInfo: {
        currentStep: PAYDAY_LOAN_STEP.ELECTRONIC_IDENTIFIERS,
        lastStep: PAYDAY_LOAN_STEP.CONTRACT_SIGNING,
        stepTitle: PAYDAY_LOAN_STEP_TITLE.ELECTRONIC_IDENTIFIERS,
      },
    };
  }

  setShowProfileBtn() {
    const payload = this.action.payload;

    return { ...this.state, showProfileBtn: payload };
  }

  setShowLeftBtn() {
    const payload = this.action.payload;

    return { ...this.state, showLeftBtn: payload };
  }

  setShowRightBtn() {
    const payload = this.action.payload;

    return { ...this.state, showRightBtn: payload };
  }

  setNavigationTitle() {
    const payload = this.action.payload;

    return { ...this.state, navigationTitle: payload };
  }

  resetNavigationTitle() {
    return { ...this.state, navigationTitle: 'Ứng lương 0% lãi' };
  }

  resetPaydayLoanInfo() {
    return {
      ...this.state,
      showStepProgressBar: false,
      showStepNavigation: false,
      showProfileBtn: false,
      showLeftBtn: false,
      showRightBtn: false,
      navigationTitle: 'Ứng lương 0% lãi',
      stepNavigationInfo: {
        currentStep: PAYDAY_LOAN_STEP.ELECTRONIC_IDENTIFIERS,
        lastStep: PAYDAY_LOAN_STEP.CONTRACT_SIGNING,
        stepTitle: PAYDAY_LOAN_STEP_TITLE.ELECTRONIC_IDENTIFIERS,
      },
      showNavigationBar: true
    };
  }

  setShowNavigationBar() {
    const payload = this.action.payload;

    return { ...this.state, showNavigationBar: payload };
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
    case fromActions.SET_SHOW_STEP_PROGRESS_BAR:
      return paydayLoanActions.setShowStepProgressBar();
    case fromActions.SET_SHOW_STEP_NAVIGATION:
      return paydayLoanActions.setShowStepNavigation();
    case fromActions.SET_STEP_NAVIGATION_INFO:
      return paydayLoanActions.setStepNavigationInfo();
    case fromActions.RESET_STEP_NAVIGATION_INFO:
      return paydayLoanActions.resetStepNavigationInfo();
    case fromActions.SET_SHOW_PROFILE_BTN:
      return paydayLoanActions.setShowProfileBtn();
    case fromActions.SET_SHOW_LEFT_BTN:
      return paydayLoanActions.setShowLeftBtn();
    case fromActions.SET_SHOW_RIGHT_BTN:
      return paydayLoanActions.setShowRightBtn();
    case fromActions.SET_NAVIGATION_TITLE:
      return paydayLoanActions.setNavigationTitle();
    case fromActions.RESET_NAVIGATION_TITLE:
      return paydayLoanActions.resetNavigationTitle();
    case fromActions.RESET_PAYDAY_LOAN_INFO:
      return paydayLoanActions.resetPaydayLoanInfo();
    case fromActions.SET_SHOW_NAVIGATION_BAR:
      return paydayLoanActions.setShowNavigationBar();
    default: {
      return state;
    }
  }
}