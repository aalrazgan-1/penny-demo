import { createReducer, on } from '@ngrx/store';
import { loginSuccess, loginFailure, logout } from './auth.actions';

export interface AuthState {
  token: string | null;
  expiresAt: string | null;
  error: string | null;
}

export const initialState: AuthState = {
  token: null,
  expiresAt: null,
  error: null,
};

export const authReducer = createReducer(
  initialState,
  on(loginSuccess, (state, { token, expiresAt }) => ({
    ...state,
    token,
    expiresAt,
    error: null,
  })),
  on(loginFailure, (state, { error }) => ({
    ...state,
    token: null,
    error,
  })),
  on(logout, () => initialState)
);
