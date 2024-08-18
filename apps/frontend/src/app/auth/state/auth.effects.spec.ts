import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { AuthEffects } from './auth.effects';
import { AuthService } from '../services/auth.service';
import { login, loginSuccess, loginFailure, logout } from './auth.actions';
import { Observable, of, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { Action } from '@ngrx/store';

describe('AuthEffects', () => {
  let actions$: Observable<Action>;
  let effects: AuthEffects;
  let authServiceMock: Partial<AuthService>;
  let routerMock: Partial<Router>;

  beforeEach(() => {
    authServiceMock = {
      login: jest.fn(),
    };

    routerMock = {
      navigate: jest.fn(),
    };

    TestBed.configureTestingModule({
      providers: [
        AuthEffects,
        { provide: AuthService, useValue: authServiceMock },
        { provide: Router, useValue: routerMock },
        provideMockActions(() => actions$),
      ],
    });

    effects = TestBed.inject(AuthEffects);
  });

  it('should dispatch loginSuccess on successful login', (done) => {
    const loginAction = login({ email: 'test@example.com', password: 'password' });
    const successResponse = { access_token: 'mock-token', expiresAt: '3600' };

    (authServiceMock.login as jest.Mock).mockReturnValue(of(successResponse));

    actions$ = of(loginAction);

    effects.login$.subscribe((result) => {
      expect(result).toEqual(loginSuccess({ token: 'mock-token', expiresAt: '3600' }));
      done();
    });
  });

  it('should dispatch loginFailure on failed login', (done) => {
    const loginAction = login({ email: 'test@example.com', password: 'wrong-password' });
    const errorResponse = new Error('Invalid credentials');

    (authServiceMock.login as jest.Mock).mockReturnValue(throwError(() => errorResponse));

    actions$ = of(loginAction);

    effects.login$.subscribe((result) => {
      expect(result).toEqual(loginFailure({ error: 'Invalid credentials' }));
      done();
    });
  });

  it('should navigate to /home on loginSuccess', (done) => {
    const loginSuccessAction = loginSuccess({ token: 'mock-token', expiresAt: '3600' });

    actions$ = of(loginSuccessAction);

    effects.loginSuccess$.subscribe(() => {
      expect(routerMock.navigate).toHaveBeenCalledWith(['/home']);
      done();
    });
  });

  it('should clear localStorage and navigate to /login on logout', (done) => {
    const logoutAction = logout();

    const removeItemMock = jest.fn();
    Object.defineProperty(window, 'localStorage', {
      value: {
        removeItem: removeItemMock,
        getItem: jest.fn(),
        setItem: jest.fn(),
        clear: jest.fn(),
      },
      writable: true,
    });

    actions$ = of(logoutAction);

    effects.logout$.subscribe(() => {
      expect(removeItemMock).toHaveBeenCalledWith('token');
      expect(removeItemMock).toHaveBeenCalledWith('tokenExpiry');
      expect(routerMock.navigate).toHaveBeenCalledWith(['/login']);
      done();
    });
  });
});
