import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { map, tap } from 'rxjs/operators';

import * as fromActions from '../actions';
import { NotificationService } from '../../services/notification.service';

@Injectable()
export class GeneralEffects {
  constructor(
    private actions$: Actions,
    private notificationService: NotificationService
  ) {}

  showErrorModal$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(fromActions.SHOW_ERROR_MODAL),
        map((action: fromActions.ShowErrorModal) => action.payload),
        tap((payload: any) => {
          this.notificationService.openErrorModal(payload);
        })
      ),
    { dispatch: false }
  );

  showSuccessModal$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(fromActions.SHOW_SUCCESS_MODAL),
        map((action: fromActions.ShowErrorModal) => action.payload),
        tap((payload: any) => {
          this.notificationService.openSuccessModal(payload);
        })
      ),
    { dispatch: false }
  );
}
