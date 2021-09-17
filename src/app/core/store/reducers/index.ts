import { ActionReducerMap, createFeatureSelector } from '@ngrx/store';
import * as fromRouter from '@ngrx/router-store';

import * as fromRouterReducers from './router.reducer';
import * as fromLoginReducers from './login.reducer';
import * as fromCustomerReducers from './customer.reducer';
import * as fromGeneralReducers from './general.reducer';
import * as fromPaydayLoanReducers from './paydayloan.reducer';
import { paydayLoanReducer } from './paydayloan.reducer';

export * from './router.reducer';

// Feature by core module
export interface State {
  login: fromLoginReducers.LoginState;
  customer: fromCustomerReducers.CustomerState;
  routerReducer: fromRouter.RouterReducerState<fromRouterReducers.RouterStateUrl>;
  general: fromGeneralReducers.GeneralState;
  paydayLoan: fromPaydayLoanReducers.PaydayLoanState;
}

export const CORE_INITIAL_STATE: State = {
  login: fromLoginReducers.LOGIN_INITIAL_STATE,
  customer: fromCustomerReducers.CUSTOMER_INITIAL_STATE,
  routerReducer: null,
  general: fromGeneralReducers.GENERAL_INITIAL_STATE,
  paydayLoan: fromPaydayLoanReducers.PAYDAY_LOAN_INITIAL_STATE,
};

export const reducers: ActionReducerMap<State> = {
  routerReducer: fromRouter.routerReducer,
  login: fromLoginReducers.loginReducer,
  customer: fromCustomerReducers.customerReducer,
  general: fromGeneralReducers.generalReducer,
  paydayLoan: fromPaydayLoanReducers.paydayLoanReducer,
};

export const getRouterState =
  createFeatureSelector<
    fromRouter.RouterReducerState<fromRouterReducers.RouterStateUrl>
  >('routerReducer');

export const getCoreState = createFeatureSelector<State>('core');
