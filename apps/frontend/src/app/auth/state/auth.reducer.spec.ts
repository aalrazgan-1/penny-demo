import { authReducer, initialState, AuthState } from './auth.reducer';
import { loginSuccess, loginFailure, logout } from './auth.actions';

describe('AuthReducer', () => {
  it('should return the initial state', () => {
    const action = { type: 'unknown' };
    const state = authReducer(undefined, action);

    expect(state).toEqual(initialState);
  });

  it('should handle loginSuccess and set the token, expiresAt, and clear error', () => {
    const action = loginSuccess({ token: 'mock-token', expiresAt: '3600' });
    const expectedState: AuthState = {
      token: 'mock-token',
      expiresAt: '3600',
      error: null,
    };

    const state = authReducer(initialState, action);

    expect(state).toEqual(expectedState);
  });

  it('should handle loginFailure and set the error, clear token', () => {
    const action = loginFailure({ error: 'Login failed' });
    const expectedState: AuthState = {
      token: null,
      expiresAt: null,
      error: 'Login failed',
    };

    const state = authReducer(initialState, action);

    expect(state).toEqual(expectedState);
  });

  it('should handle logout and reset the state to initialState', () => {
    const action = logout();
    const modifiedState: AuthState = {
      token: 'existing-token',
      expiresAt: '3600',
      error: null,
    };

    const state = authReducer(modifiedState, action);

    expect(state).toEqual(initialState);
  });
});
