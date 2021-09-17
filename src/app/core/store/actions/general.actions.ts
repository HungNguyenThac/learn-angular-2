import { Action } from '@ngrx/store';

export const SHOW_ERROR_MODAL = '[Error] show error modal';
export const SHOW_SUCCESS_MODAL = '[Success] show success modal';

export class ShowErrorModal implements Action {
  readonly type = SHOW_ERROR_MODAL;

  constructor(public payload: any) {}
}

export class ShowSuccessModal implements Action {
  readonly type = SHOW_SUCCESS_MODAL;

  constructor(public payload: any) {}
}

export type GeneralActions = ShowErrorModal | ShowSuccessModal;
