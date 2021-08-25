import {ActionReducerMap, createFeatureSelector} from '@ngrx/store';
import * as fromRouter from '@ngrx/router-store';

import * as fromRouterReducers from './router.reducer';
import * as fromLoginReducers from './login.reducer';
import * as fromCustomerReducers from './customer.reducer';

export * from './router.reducer';

// Feature by core module
export interface State {
    login: fromLoginReducers.LoginState;
    customer: fromCustomerReducers.CustomerState;
    routerReducer: fromRouter.RouterReducerState<fromRouterReducers.RouterStateUrl>;
}

export const CORE_INITIAL_STATE: State = {
    login: fromLoginReducers.LOGIN_INITIAL_STATE,
    customer: fromCustomerReducers.CUSTOMER_INITIAL_STATE,
    routerReducer: null
};


export const reducers: ActionReducerMap<State> = {
    routerReducer: fromRouter.routerReducer,
    login: fromLoginReducers.loginReducer,
    customer: fromCustomerReducers.customerReducer
};


export const getRouterState = createFeatureSelector<
  fromRouter.RouterReducerState<fromRouterReducers.RouterStateUrl>
>('routerReducer');

export const getCoreState = createFeatureSelector<State>(
  'core'
);
