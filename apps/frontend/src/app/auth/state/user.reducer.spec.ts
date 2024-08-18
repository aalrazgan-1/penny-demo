import { userReducer, initialState, UserState } from './user.reducer';
import { signupSuccess, signupFailure, checkEmailSuccess, checkEmailFailure } from './user.actions';

describe('UserReducer', () => {
  it('should return the initial state', () => {
    const action = { type: 'unknown' };
    const state = userReducer(undefined, action);

    expect(state).toEqual(initialState);
  });

  it('should handle signupSuccess and clear the error', () => {
    const action = signupSuccess();
    const stateWithError: UserState = {
      ...initialState,
      error: 'An error occurred',
    };

    const state = userReducer(stateWithError, action);

    expect(state).toEqual({
      ...stateWithError,
      error: null,
    });
  });

  it('should handle signupFailure and set the error', () => {
    const error = 'Signup failed';
    const action = signupFailure({ error });
    const expectedState: UserState = {
      ...initialState,
      error,
    };

    const state = userReducer(initialState, action);

    expect(state).toEqual(expectedState);
  });

  it('should handle checkEmailSuccess and set isEmailDuplicate', () => {
    const isDuplicate = true;
    const action = checkEmailSuccess({ isDuplicate });
    const expectedState: UserState = {
      ...initialState,
      isEmailDuplicate: isDuplicate,
    };

    const state = userReducer(initialState, action);

    expect(state).toEqual(expectedState);
  });

  it('should handle checkEmailFailure and set the error', () => {
    const error = 'Error checking email';
    const action = checkEmailFailure({ error });
    const expectedState: UserState = {
      ...initialState,
      error,
    };

    const state = userReducer(initialState, action);

    expect(state).toEqual(expectedState);
  });
});
