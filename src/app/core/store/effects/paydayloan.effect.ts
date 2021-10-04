import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs/observable/of';
import { catchError, map, switchMap } from 'rxjs/operators';

import * as fromActions from '../actions';
import { MatDialog } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import * as fromStore from '../index';
import { Observable, Subscription } from 'rxjs';
import {
  ApiResponsePaydayLoan,
  ApplicationControllerService,
} from '../../../../../open-api-modules/loanapp-api-docs';

@Injectable()
export class PaydayloanEffects {
  customerId$: Observable<string>;
  customerId: string;

  coreToken$: Observable<string>;
  coreToken: string;

  subManager = new Subscription();

  constructor(
    private actions$: Actions,
    private store$: Store<fromStore.State>,
    private applicationControllerService: ApplicationControllerService,
  ) {
    this.customerId$ = store$.select(fromStore.getCustomerIdState);
    this.subManager.add(
      this.customerId$.subscribe((customer_id) => {
        this.customerId = customer_id;
      })
    );
    this.coreToken$ = store$.select(fromStore.getCoreTokenState);
    this.subManager.add(
      this.coreToken$.subscribe((coreToken) => {
        this.coreToken = coreToken;
      })
    );
  }

  getActiveLoanInfo$ = createEffect(() =>
    this.actions$.pipe(
      ofType(fromActions.GET_ACTIVE_LOAN_INFO),
      map((action: fromActions.GetActiveLoanInfo) => action.payload),
      switchMap((payload: any) => {
        console.log('vao day nay', payload)
        if (!this.coreToken || !this.customerId) {
          return null;
        }
        return this.applicationControllerService
          .getActiveLoan(this.customerId, this.coreToken)
          .pipe(
            map((response: ApiResponsePaydayLoan) => {
              console.log('Effect Response:', response);
              return new fromActions.GetActiveLoanInfoSuccess(response);
            }),
            catchError((error) =>
              of(new fromActions.GetActiveLoanInfoError(error))
            )
          );
      })
    )
  );
}
