import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SignupComponent } from './signup.component';
import { Store } from '@ngrx/store';
import { ReactiveFormsModule } from '@angular/forms';
import { of } from 'rxjs';
import * as UserActions from '../auth/state/user.actions';
import { By } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';

describe('SignupComponent', () => {
  let component: SignupComponent;
  let fixture: ComponentFixture<SignupComponent>;
  let store: Partial<Store>;
  let dispatchSpy: jest.SpyInstance;

  beforeEach(async () => {
    const storeMock = {
      dispatch: jest.fn(),
      pipe: jest.fn(() => of(true)),
    };

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, SignupComponent],
      providers: [
        { provide: Store, useValue: storeMock },
        { provide: ActivatedRoute, useValue: {} } 
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(SignupComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(Store);
    dispatchSpy = jest.spyOn(store, 'dispatch');

    fixture.detectChanges();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create the component and initialize the form', () => {
    expect(component).toBeTruthy();
    expect(component.signupForm).toBeDefined();
    expect(component.signupForm.get('email')).toBeDefined();
    expect(component.signupForm.get('password')).toBeDefined();
    expect(component.signupForm.get('firstName')).toBeDefined();
    expect(component.signupForm.get('lastName')).toBeDefined();
  });

  it('should show form validation errors', () => {
    const emailControl = component.signupForm.get('email');
    emailControl?.setValue('');
    emailControl?.markAsTouched();
    fixture.detectChanges();

    const emailError = fixture.debugElement.query(By.css('.invalid-feedback span'));
    expect(emailError.nativeElement.textContent).toContain('Email is required.');
  });

  it('should dispatch signup action when form is valid', () => {
    component.signupForm.setValue({
      email: 'test@example.com',
      password: 'password',
      firstName: 'John',
      lastName: 'Doe'
    });

    component.signup();
    expect(dispatchSpy).toHaveBeenCalledWith(UserActions.signup({
      email: 'test@example.com',
      password: 'password',
      firstName: 'John',
      lastName: 'Doe'
    }));
  });

  it('should set formError when form is invalid', () => {
    component.signupForm.get('email')?.setValue('');
    component.signup();

    expect(component.formError).toBe('Please fill in all required fields correctly.');
  });

  it('should dispatch checkEmail action on email blur and set duplicate error', () => {
    const emailControl = component.signupForm.get('email');
    emailControl?.setValue('test@example.com');
    emailControl?.markAsTouched();

    jest.spyOn(store, 'pipe').mockReturnValue(of(true));

    component.onEmailBlur();

    expect(dispatchSpy).toHaveBeenCalledWith(UserActions.checkEmail({ email: 'test@example.com' }));

    fixture.detectChanges();
    expect(emailControl?.errors?.['duplicate']).toBeTruthy();
  });

  it('should clear formError when dismissAlert is called', () => {
    component.formError = 'Some error';
    component.dismissAlert();
    expect(component.formError).toBeNull();
  });
});
