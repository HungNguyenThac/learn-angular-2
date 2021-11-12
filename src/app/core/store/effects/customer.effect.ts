import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs/observable/of';
import { catchError, map, switchMap, tap } from 'rxjs/operators';

import * as fromActions from '../actions';
import {
  ApiResponseCustomerInfoResponse,
  InfoControllerService,
  RatingControllerService,
} from '../../../../../open-api-modules/customer-api-docs';
import { Store } from '@ngrx/store';
import * as fromStore from '../index';
import { Observable, Subscription } from 'rxjs';
import { RESPONSE_CODE } from '../../common/enum/operator';

@Injectable()
export class CustomerEffects {
  customerId$: Observable<any>;
  customerId: string;
  subManager = new Subscription();

  constructor(
    private actions$: Actions,
    private store$: Store<fromStore.State>,
    private infoControllerService: InfoControllerService,
    private ratingControllerService: RatingControllerService
  ) {
    this.customerId$ = store$.select(fromStore.getCustomerIdState);
    this.subManager.add(
      this.customerId$.subscribe((customer_id) => {
        this.customerId = customer_id;
      })
    );
  }

  getCustomerInfo$ = createEffect(() =>
    this.actions$.pipe(
      ofType(fromActions.GET_CUSTOMER_INFO),
      map((action: fromActions.GetCustomerInfo) => action.payload),
      switchMap((customerId: string) => {
        return this.infoControllerService.getInfo(customerId).pipe(
          map((response: ApiResponseCustomerInfoResponse) => {
            console.log('Effect Response:', response);
            if (!response || response.responseCode !== RESPONSE_CODE.SUCCESS) {
              return new fromActions.GetCustomerInfoError(response.errorCode);
            }
            return new fromActions.GetCustomerInfoSuccess(response.result);
          }),
          catchError((error) => of(new fromActions.GetCustomerInfoError(error)))
        );
      })
    )
  );

  getCustomerInfoSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(fromActions.GET_CUSTOMER_INFO_SUCCESS),
        map((action: fromActions.GetCustomerInfoSuccess) => action.payload),
        tap((response: ApiResponseCustomerInfoResponse) => {})
      ),
    { dispatch: false }
  );
}
