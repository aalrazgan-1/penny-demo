import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HomeComponent } from './home.component';
import { AuthService } from '../auth/services/auth.service';
import { Store } from '@ngrx/store';
import { of, throwError } from 'rxjs';
import * as AuthActions from '../auth/state/auth.actions';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let authServiceMock: any;
  let storeMock: Partial<Store>;
  let dispatchSpy: jest.SpyInstance;

  beforeEach(async () => {
    authServiceMock = {
      getProfile: jest.fn(),
    };

    storeMock = {
      dispatch: jest.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [HomeComponent],
      providers: [
        { provide: AuthService, useValue: authServiceMock },
        { provide: Store, useValue: storeMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    dispatchSpy = jest.spyOn(storeMock, 'dispatch');
  });

  it('should create the component', () => {
    const mockProfile = { userId: '123', email: 'test@example.com' };
    authServiceMock.getProfile.mockReturnValue(of(mockProfile));

    fixture.detectChanges();

    expect(component).toBeTruthy();
  });

  it('should fetch and display profile data on init', () => {
    const mockProfile = { userId: '123', email: 'test@example.com' };
    authServiceMock.getProfile.mockReturnValue(of(mockProfile));

    fixture.detectChanges(); // Trigger ngOnInit

    expect(authServiceMock.getProfile).toHaveBeenCalled();
    expect(component.profile).toEqual(mockProfile);

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('p')?.textContent).toContain('123');
    expect(compiled.querySelector('p + p')?.textContent).toContain('test@example.com');
  });

  it('should handle error when fetching profile data', () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
    authServiceMock.getProfile.mockReturnValue(throwError(() => new Error('Failed to fetch profile')));

    fixture.detectChanges(); // Trigger initial data binding, including ngOnInit

    expect(authServiceMock.getProfile).toHaveBeenCalled();
    expect(component.profile).toBeNull();
    expect(consoleSpy).toHaveBeenCalledWith('Failed to fetch profile', expect.any(Error));

    consoleSpy.mockRestore();
  });

  it('should dispatch logout action when onLogout is called', () => {
    component.onLogout();
    expect(dispatchSpy).toHaveBeenCalledWith(AuthActions.logout());
  });
});
