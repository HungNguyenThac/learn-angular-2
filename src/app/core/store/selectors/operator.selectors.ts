import * as fromFeature from '../reducers';
import { createSelector } from '@ngrx/store';

// selectors
export const getActiveNavItemState = createSelector(
  fromFeature.getCoreState,
  (state: fromFeature.State) => state.operator.activeNavItem
);
