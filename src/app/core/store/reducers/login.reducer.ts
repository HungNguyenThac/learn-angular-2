import * as actions from '../actions';
import {Auth} from '../../../public/models';
import {HttpErrorResponse} from '@angular/common/http';
import jwt_decode from "jwt-decode";
import {Token} from "../../../public/models/token.model";

export interface LoginState {
    authorization: Auth;
    loginProcess: string;
    loginError: HttpErrorResponse;
}

export const LOGIN_INITIAL_STATE: LoginState = {
    authorization: null,
    loginProcess: null,
    loginError: null,
};

class LoginActions {

    constructor(private state: LoginState, private action: actions.LoginActions) {
    }

    signin() {
        const payload = this.action.payload;
        return {...this.state, loginProcess: 'Proccess login...'}
    }

    success() {
        if (!this.action.payload || !this.action.payload.responseCode || this.action.payload.responseCode !== 200) return this.state;
        const decodedResult: Token = jwt_decode(this.action.payload.result?.token);
        const payload: Auth = {
            token: this.action.payload.result?.token,
            exp: decodedResult.exp,
            customerId: decodedResult.sub,
            authorities: decodedResult.authorities,
        };
        return {
            ...this.state,
            authorization: payload,
            loginProcess: null,
            loginError: null
        }

    }

    error() {
        const payload: HttpErrorResponse = this.action.payload;
        return {...this.state, loginError: payload};
    }

    logout() {
        return {
            authorization: null,
            loginProcess: null,
            loginError: null
        };
    }

}

export function loginReducer(state: LoginState = LOGIN_INITIAL_STATE, action: actions.LoginActions): LoginState {

    const loginActions: LoginActions = new LoginActions(state, action);

    switch (action.type) {
        case actions.LOGIN_SIGNIN: {
            return loginActions.signin();
        }

        case actions.LOGIN_SIGNIN_SUCCESS: {
            return loginActions.success();
        }

        case actions.LOGIN_SIGNIN_ERROR: {
            return loginActions.error();
        }

        case actions.LOGIN_SIGN_OUT: {
            return loginActions.logout();
        }

        default: {
            return state;
        }
    }
}
