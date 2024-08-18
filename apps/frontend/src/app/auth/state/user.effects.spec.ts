import { TestBed } from '@angular/core/testing';
import { UserEffects } from './user.effects';
import { provideMockActions } from '@ngrx/effects/testing';
import { Observable, of, throwError } from 'rxjs';
import { UserService } from '../services/user.service';
import { signup, signupSuccess, signupFailure, checkEmail, checkEmailSuccess, checkEmailFailure } from './user.actions';
import { Action } from '@ngrx/store';
import { Router } from '@angular/router';

describe('UserEffects', () => {
  let actions$: Observable<Action>;
  let effects: UserEffects;
  let userServiceMock: Partial<UserService>;
  let routerMock: Partial<Router>;

  beforeEach(() => {
    userServiceMock = {
      signup: jest.fn(),
      checkEmail: jest.fn(),
    };

    routerMock = {
      navigate: jest.fn(),
    };

    TestBed.configureTestingModule({
      providers: [
        UserEffects,
        provideMockActions(() => actions$),
        { provide: UserService, useValue: userServiceMock },
        { provide: Router, useValue: routerMock },
      ],
    });

    effects = TestBed.inject(UserEffects);
  });

  it('should dispatch signupSuccess on successful signup', (done) => {
    const signupAction = signup({ email: 'test@example.com', password: 'password', firstName: 'John', lastName: 'Doe' });
    (userServiceMock.signup as jest.Mock).mockReturnValue(of({}));

    actions$ = of(signupAction);

    effects.signup$.subscribe((result) => {
      expect(result).toEqual(signupSuccess());
      done();
    });
  });

  it('should dispatch signupFailure on failed signup', (done) => {
    const signupAction = signup({ email: 'test@example.com', password: 'password', firstName: 'John', lastName: 'Doe' });
    const errorResponse = new Error('Signup failed');
    (userServiceMock.signup as jest.Mock).mockReturnValue(throwError(() => errorResponse));

    actions$ = of(signupAction);

    effects.signup$.subscribe((result) => {
      expect(result).toEqual(signupFailure({ error: 'Unable to sign up. Please try again.' }));
      done();
    });
  });

  it('should navigate to /login on signupSuccess', (done) => {
    const signupSuccessAction = signupSuccess();

    actions$ = of(signupSuccessAction);

    effects.signupSuccess$.subscribe(() => {
      expect(routerMock.navigate).toHaveBeenCalledWith(['/login']);
      done();
    });
  });

  it('should dispatch checkEmailSuccess on successful email check', (done) => {
    const checkEmailAction = checkEmail({ email: 'test@example.com' });
    (userServiceMock.checkEmail as jest.Mock).mockReturnValue(of({ isDuplicate: true }));

    actions$ = of(checkEmailAction);

    effects.checkEmail$.subscribe((result) => {
      expect(result).toEqual(checkEmailSuccess({ isDuplicate: true }));
      done();
    });
  });

  it('should dispatch checkEmailFailure on failed email check', (done) => {
    const checkEmailAction = checkEmail({ email: 'test@example.com' });
    const errorResponse = new Error('Email check failed');
    (userServiceMock.checkEmail as jest.Mock).mockReturnValue(throwError(() => errorResponse));

    actions$ = of(checkEmailAction);

    effects.checkEmail$.subscribe((result) => {
      expect(result).toEqual(checkEmailFailure({ error: 'Unable to check email. Please try again.' }));
      done();
    });
  });
});
