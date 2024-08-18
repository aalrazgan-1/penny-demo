import { TestBed } from '@angular/core/testing';
import { appConfig } from './app.config';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { Store } from '@ngrx/store';
import { Router } from '@angular/router';
import { appRoutes } from './app.routes';
import { AuthInterceptor } from './auth/interceptors/auth.interceptor';

describe('AppConfig', () => {
  let store: Store;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [...appConfig.providers],
    });

    store = TestBed.inject(Store);
  });

  it('should provide the correct HTTP interceptors', () => {
    const interceptors = TestBed.inject(HTTP_INTERCEPTORS);
    expect(
      interceptors.some((interceptor) => interceptor instanceof AuthInterceptor)
    ).toBe(true);
  });

  it('should provide the correct router configuration', () => {
    const router = TestBed.inject(Router);
    expect(router).toBeTruthy();
    expect(router.config).toEqual(appRoutes);
  });
});
