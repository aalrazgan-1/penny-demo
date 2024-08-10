import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { AuthService } from '../services/auth.service';
import { login, loginSuccess, loginFailure, logout } from './auth.actions';
import { map, catchError, mergeMap, tap } from 'rxjs/operators';
import { of } from 'rxjs';
import { Router } from '@angular/router';

@Injectable()
export class AuthEffects {
  private authService = inject(AuthService);
  private router = inject(Router);
  actions$ = inject(Actions);

  login$ = createEffect(() =>
    this.actions$.pipe(
      ofType(login),
      mergeMap(action =>
        this.authService.login(action.email, action.password).pipe(
          map(data => {
            const { access_token, expiresAt } = data;
            const expiryDate = new Date().getTime() + expiresAt * 1000;

            localStorage.setItem('token', access_token);
            localStorage.setItem('tokenExpiry', expiryDate.toString());

            return loginSuccess({
              token: data.access_token,
              expiresAt: data.expiresAt,
            });
          }),
          catchError(error => {
            return of(loginFailure({ error: error.message || 'Unknown error' }));
          })
        )
      )
    )
  );

  loginSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loginSuccess),
      tap(() => this.router.navigate(['/home']))  
    ),
    { dispatch: false }
  );

  logout$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(logout),
        tap(() => {
          localStorage.removeItem('token');
          localStorage.removeItem('tokenExpiry');

          this.router.navigate(['/login']);
        })
      ),
    { dispatch: false }
  );
}
