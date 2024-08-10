import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Store } from '@ngrx/store';
import { Observable, from } from 'rxjs';
import { switchMap, take } from 'rxjs/operators';
import { AuthState } from '../state/auth.reducer';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private store: Store<{ auth: AuthState }>) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return this.store.select('auth').pipe(
      take(1),
      switchMap(authState => {
        if (authState.token) {
          const cloned = req.clone({
            headers: req.headers.set('Authorization', `Bearer ${authState.token}`)
          });
          return next.handle(cloned);
        }
        return next.handle(req);
      })
    );
  }
}
