import {Injectable} from '@angular/core';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {of} from 'rxjs/observable/of';
import {catchError, map, switchMap, tap} from 'rxjs/operators';

import * as fromActions from '../actions';
import {Customer} from '../../../public/models';
import {
  ApiResponseCustomerInfoResponse,
  InfoControllerService
} from "../../../../../open-api-modules/customer-api-docs";

@Injectable()
export class CustomerEffects {
    constructor(
        private actions$: Actions,
        private infoControllerService: InfoControllerService
    ) {
    }


    getCustomerInfo$ = createEffect(() => this.actions$.pipe(
        ofType(fromActions.GET_CUSTOMER_INFO),
        map((action: fromActions.GetCustomerInfo) => action.payload),
        switchMap((customerId: string) => {
            return this.infoControllerService.getInfo(customerId).pipe(
                map((response: ApiResponseCustomerInfoResponse) => {
                    console.log('Effect Response:', response);
                    return new fromActions.GetCustomerInfoSuccess(response);
                }),
                catchError(error => of(new fromActions.GetCustomerInfoError(error)))
            );
        })
    ));

    getCustomerInfoSuccess$ = createEffect(() => this.actions$.pipe(ofType(fromActions.GET_CUSTOMER_INFO_SUCCESS), tap(() => {
    })), {dispatch: false});

}
