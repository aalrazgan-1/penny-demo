import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { UserService } from '../services/user.service';
import { signup, signupSuccess, signupFailure, checkEmail, checkEmailSuccess, checkEmailFailure } from './user.actions';
import { map, catchError, mergeMap, tap } from 'rxjs/operators';
import { of } from 'rxjs';
import { Router } from '@angular/router';

@Injectable()
export class UserEffects {
  private userService = inject(UserService);
  private router = inject(Router);
  actions$ = inject(Actions);

  signup$ = createEffect(() =>
    this.actions$.pipe(
      ofType(signup),
      mergeMap(action =>
        this.userService.signup({
          email: action.email,
          password: action.password,
          firstName: action.firstName,
          lastName: action.lastName
        }).pipe(
          map(() => signupSuccess()),
          catchError(error => {
            return of(signupFailure({ error: 'Unable to sign up. Please try again.' }));
          })
        )
      )
    )
  );

  signupSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(signupSuccess),
      tap(() => this.router.navigate(['/login']))
    ),
    { dispatch: false }
  );

  checkEmail$ = createEffect(() =>
    this.actions$.pipe(
      ofType(checkEmail),
      mergeMap(action =>
        this.userService.checkEmail(action.email).pipe(
          map(data => checkEmailSuccess({ isDuplicate: data.isDuplicate })),
          catchError(error => of(checkEmailFailure({ error: 'Unable to check email. Please try again.' })))
        )
      )
    )
  );
}
