import { createReducer, on } from '@ngrx/store';
import { signupSuccess, signupFailure, checkEmailSuccess, checkEmailFailure } from './user.actions';

export interface UserState {
  error: string | null;
  isEmailDuplicate: boolean | null;
}

export const initialState: UserState = {
  error: null,
  isEmailDuplicate: null,
};

export const userReducer = createReducer(
  initialState,
  on(signupSuccess, state => ({
    ...state,
    error: null,
  })),
  on(signupFailure, (state, { error }) => ({
    ...state,
    error,
  })),
  on(checkEmailSuccess, (state, { isDuplicate }) => ({
    ...state,
    isEmailDuplicate: isDuplicate,
  })),
  on(checkEmailFailure, (state, { error }) => ({
    ...state,
    error,
  }))
);
