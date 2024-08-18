import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { Location } from '@angular/common';

import { appRoutes } from './app.routes';
import { SignupComponent } from './signup/signup.component';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { AuthGuard } from './auth/guards/auth.guard';
import { of } from 'rxjs/internal/observable/of';

describe('AppRoutes', () => {
  let router: Router;
  let location: Location;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        SignupComponent,
        LoginComponent,
        HomeComponent
      ],
      providers: [
        provideRouter(appRoutes),
        { provide: AuthGuard, useValue: { canActivate: () => true } },
      ],
    }).compileComponents();

    router = TestBed.inject(Router);
    location = TestBed.inject(Location);

    router.initialNavigation(); // Trigger initial navigation
  });

  it('should redirect to /login when navigating to the root path', async () => {
    await router.navigate(['']);
    expect(location.path()).toBe('/login');
  });

  it('should navigate to /signup when navigating to signup path', async () => {
    await router.navigate(['/signup']);
    expect(location.path()).toBe('/signup');
  });

  it('should navigate to /login when navigating to login path', async () => {
    await router.navigate(['/login']);
    expect(location.path()).toBe('/login');
  });

  it('should navigate to /home when navigating to home path', async () => {
    await router.navigate(['/home']);
    expect(location.path()).toBe('/home');
  });

  it('should not navigate to /home if AuthGuard prevents it', async () => {
    const authGuard = TestBed.inject(AuthGuard);
    jest.spyOn(authGuard, 'canActivate').mockReturnValue(of(false));

    await router.navigate(['/home']);
    expect(location.path()).not.toBe('/home');
  });
});
