import { TestBed } from '@angular/core/testing';
import { provideHttpClient, HTTP_INTERCEPTORS, HttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { AuthState } from '../state/auth.reducer';
import { AuthInterceptor } from './auth.interceptor';

describe('AuthInterceptor', () => {
  let httpMock: HttpTestingController;
  let storeMock: Partial<Store>;
  let authState: AuthState;
  let httpClient: HttpClient;

  beforeEach(() => {
    storeMock = {
      select: jest.fn(),
    };

    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),
        { provide: Store, useValue: storeMock },
        { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true,},
      ],
    });

    httpMock = TestBed.inject(HttpTestingController);
    httpClient = TestBed.inject(HttpClient);
  });

  it('should add an Authorization header when token is present', () => {
    (storeMock.select as jest.Mock).mockReturnValue(of({ token: 'valid-token', expiresAt: null, error: null }));
    httpClient.get('/test-endpoint').subscribe();

    const httpRequest = httpMock.expectOne('/test-endpoint');
    expect(httpRequest.request.headers.has('Authorization')).toBeTruthy();
    expect(httpRequest.request.headers.get('Authorization')).toBe(`Bearer valid-token`);

    httpMock.verify();
  });

  it('should not add an Authorization header when token is absent', () => {
    (storeMock.select as jest.Mock).mockReturnValue(of({ token: null, expiresAt: null, error: null }));
    httpClient.get('/test-endpoint').subscribe();

    const httpRequest = httpMock.expectOne('/test-endpoint');
    expect(httpRequest.request.headers.has('Authorization')).toBeFalsy();

    httpMock.verify();
  });
});
