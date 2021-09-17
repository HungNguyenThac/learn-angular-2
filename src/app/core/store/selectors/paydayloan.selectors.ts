import * as fromFeature from '../reducers';
import {createSelector} from '@ngrx/store';

// selectors
export const getEkycInfo = createSelector(
  fromFeature.getCoreState,
  (state: fromFeature.State) => state.paydayLoan.ekycInfo
);
