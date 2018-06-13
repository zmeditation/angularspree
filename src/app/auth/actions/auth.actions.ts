import { Action } from '@ngrx/store';
export class AuthActions {
  static LOGIN = 'LOGIN';
  static LOGIN_SUCCESS = 'LOGIN_SUCCESS';
  static LOGOUT = 'LOGOUT';
  static LOGOUT_SUCCESS = 'LOGOUT_SUCCESS';
  static AUTHORIZE = 'AUTHORIZE';
  static O_AUTH_LOGIN = 'O_AUTH_LOGIN';
  static NO_OP = 'NO_OPERATION'

  authorize() {
    return { type: AuthActions.AUTHORIZE };
  }

  login() {
    return { type: AuthActions.LOGIN };
  }

  oAuthLogin(provider: string) {
    return {
      type: AuthActions.O_AUTH_LOGIN,
      payload: provider
    };
  }

  loginSuccess() {
    return { type: AuthActions.LOGIN_SUCCESS };
  }

  logout() {
    return { type: AuthActions.LOGOUT };
  }

  logoutSuccess() {
    return { type: AuthActions.LOGOUT_SUCCESS };
  }

  noOp() {
    return { type: AuthActions.NO_OP };
  }
}
