import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { LoginComponent } from './login.component';
import { ReactiveFormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import * as AuthActions from '../auth/state/auth.actions';
import { ActivatedRoute } from '@angular/router';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let store: Partial<Store>;
  let dispatchSpy: jest.SpyInstance;

  beforeEach(async () => {
    store = {
      dispatch: jest.fn(),
      select: jest.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, LoginComponent],
      providers: [
        { provide: Store, useValue: store },
        { provide: ActivatedRoute, useValue: {} } 
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(Store)
    dispatchSpy = jest.spyOn(store, 'dispatch');

    fixture.detectChanges(); 
  });

  it('should create the component and initialize the form', () => {
    expect(component).toBeTruthy();
    expect(component.loginform).toBeTruthy();
    expect(component.loginform.get('email')).toBeTruthy();
    expect(component.loginform.get('password')).toBeTruthy();
  });

  it('should display an error message if the form is invalid and submitted', () => {
    component.login();
    expect(component.formError).toBe('Please fill in the form correctly.');
  });

  it('should dispatch the login action if the form is valid', () => {
    component.loginform.get('email')?.setValue('test@example.com');
    component.loginform.get('password')?.setValue('password123');

    (store.select as jest.Mock).mockReturnValue(of({ error: null }));

    component.login();

    expect(dispatchSpy).toHaveBeenCalledWith(
      AuthActions.login({ email: 'test@example.com', password: 'password123' })
    );
  });

  it('should set the formError if the store returns an error', () => {
    (store.select as jest.Mock).mockReturnValue(of({ error: 'Invalid email or password' }));

    component.loginform.get('email')?.setValue('test@example.com');
    component.loginform.get('password')?.setValue('password123');

    component.login();

    expect(component.formError).toBe(
      'Invalid email or password. Please try again.'
    );
  });

  it('should clear the formError if the store does not return an error', () => {
    (store.select as jest.Mock).mockReturnValue(of({ error: null }));

    component.loginform.get('email')?.setValue('test@example.com');
    component.loginform.get('password')?.setValue('password123');

    component.login();

    expect(component.formError).toBeNull();
  });

  it('should mark the form control as touched when onBlur is called', () => {
    const emailControl = component.loginform.get('email');
    emailControl?.markAsUntouched();
    
    component.onBlur('email');
    
    expect(emailControl?.touched).toBeTruthy();
  });

  it('should clear the formError when dismissAlert is called', () => {
    component.formError = 'Some error';
    
    component.dismissAlert();
    
    expect(component.formError).toBeNull();
  });
});
