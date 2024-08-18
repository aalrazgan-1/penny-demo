import { TestBed } from '@angular/core/testing';
import { AuthGuard } from './auth.guard';
import { Store } from '@ngrx/store';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { AuthState } from '../state/auth.reducer';

describe('AuthGuard', () => {
  let guard: AuthGuard;
  let storeMock: Partial<Store>;
  let routerMock: Partial<Router>;

  beforeEach(() => {
    storeMock = {
      select: jest.fn(),
    };
    routerMock = {
      navigate: jest.fn(),
    };

    TestBed.configureTestingModule({
      providers: [
        AuthGuard,
        { provide: Store, useValue: storeMock },
        { provide: Router, useValue: routerMock },
      ],
    });

    guard = TestBed.inject(AuthGuard);
  });

  it('should allow access when the token is present', (done) => {
    const authState: AuthState = {
      token: 'valid-token',
      expiresAt: null,
      error: null,
    };
    (storeMock.select as jest.Mock).mockReturnValue(of(authState));

    guard.canActivate().subscribe((canActivate) => {
      expect(canActivate).toBe(true);
      expect(routerMock.navigate).not.toHaveBeenCalled();
      done();
    });
  });

  it('should deny access and navigate to login when the token is missing', (done) => {
    const authState: AuthState = {
      token: null,
      expiresAt: null,
      error: null,
    };

    (storeMock.select as jest.Mock).mockReturnValue(of(authState));

    guard.canActivate().subscribe((canActivate) => {
      expect(canActivate).toBe(false);
      expect(routerMock.navigate).toHaveBeenCalledWith(['/login']);
      done();
    });
  });
});
