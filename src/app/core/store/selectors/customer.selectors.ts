import * as fromFeature from '../reducers';
import {createSelector} from '@ngrx/store';

// selectors
export const getCustomerState = createSelector(
  fromFeature.getCoreState,
  (state: fromFeature.State) => state.customer.customerInfo
);

export const getCustomerErrorState = createSelector(
    fromFeature.getCoreState,
    (state: fromFeature.State) => state.customer ? state.customer.loginError : ''
);

