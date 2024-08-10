import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { appRoutes } from './app.routes';
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideStore } from '@ngrx/store';
import { authReducer } from './auth/state/auth.reducer';
import { provideEffects } from '@ngrx/effects';
import { AuthEffects } from './auth/state/auth.effects';
import { AuthInterceptor } from './auth/interceptors/auth.interceptor';
import { UserEffects } from './auth/state/user.effects';
import { userReducer } from './auth/state/user.reducer';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(appRoutes),
    provideHttpClient(withInterceptorsFromDi()),
    provideStore({ auth: authReducer, user: userReducer }),
    provideEffects([AuthEffects, UserEffects]),
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    }
  ],
};
