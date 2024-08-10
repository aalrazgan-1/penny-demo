import { createAction, props } from '@ngrx/store';

export const signup = createAction(
  '[User] Signup',
  props<{ email: string; password: string; firstName: string; lastName: string }>()
);

export const signupSuccess = createAction('[User] Signup Success');

export const signupFailure = createAction(
  '[User] Signup Failure',
  props<{ error: any }>()
);

export const checkEmail = createAction(
  '[User] Check Email',
  props<{ email: string }>()
);

export const checkEmailSuccess = createAction(
  '[User] Check Email Success',
  props<{ isDuplicate: boolean }>()
);

export const checkEmailFailure = createAction(
  '[User] Check Email Failure',
  props<{ error: any }>()
);
