import { TestBed, ComponentFixture } from '@angular/core/testing';
import { Store } from '@ngrx/store';
import { AppComponent } from './app.component';
import * as AuthActions from './auth/state/auth.actions';
import { of } from 'rxjs';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let store: Store;
  let dispatchSpy: jest.SpyInstance;

  beforeEach(async () => {
    const storeMock = {
      dispatch: jest.fn(),
      select: jest.fn(() => of({})),
    };

    await TestBed.configureTestingModule({
      imports: [AppComponent],
      providers: [{ provide: Store, useValue: storeMock }],
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(Store);
    dispatchSpy = jest.spyOn(store, 'dispatch');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should dispatch loginSuccess if token and tokenExpiry exist and are valid', () => {
    const validToken = 'valid-token';
    const validTokenExpiry = (new Date().getTime() + 10000).toString();

    // Mocking localStorage manually
    const localStorageMock = {
      getItem: jest.fn((key) => {
        if (key === 'token') return validToken;
        if (key === 'tokenExpiry') return validTokenExpiry;
        return null;
      }),
      setItem: jest.fn(),
      removeItem: jest.fn(),
      clear: jest.fn(),
    };
    Object.defineProperty(window, 'localStorage', { value: localStorageMock });

    component.ngOnInit();

    expect(dispatchSpy).toHaveBeenCalledWith(
      AuthActions.loginSuccess({
        token: validToken,
        expiresAt: validTokenExpiry,
      })
    );
  });

  it('should dispatch logout if token exists but is expired', () => {
    const expiredToken = 'expired-token';
    const expiredTokenExpiry = (new Date().getTime() - 10000).toString(); // Token expiry in the past

    // Mocking localStorage manually
    const localStorageMock = {
      getItem: jest.fn((key) => {
        if (key === 'token') return expiredToken;
        if (key === 'tokenExpiry') return expiredTokenExpiry;
        return null;
      }),
      setItem: jest.fn(),
      removeItem: jest.fn(),
      clear: jest.fn(),
    };
    Object.defineProperty(window, 'localStorage', { value: localStorageMock });

    component.ngOnInit();

    expect(dispatchSpy).toHaveBeenCalledWith(AuthActions.logout());
  });

  it('should not dispatch any actions if token and tokenExpiry do not exist', () => {
    const localStorageMock = {
      getItem: jest.fn().mockReturnValue(null),
      setItem: jest.fn(),
      removeItem: jest.fn(),
      clear: jest.fn(),
    };
    Object.defineProperty(window, 'localStorage', { value: localStorageMock });

    component.ngOnInit();

    expect(dispatchSpy).not.toHaveBeenCalled();
  });

  it('should have the title "Penny Demo"', () => {
    expect(component.title).toBe('Penny Demo');
  });
});
