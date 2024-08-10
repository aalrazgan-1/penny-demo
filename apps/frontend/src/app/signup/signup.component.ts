import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Store, select } from '@ngrx/store';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import * as UserActions from '../auth/state/user.actions';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
})
export class SignupComponent {
  signupForm: FormGroup;
  formError: string | null = null;
  isEmailDuplicate$: Observable<boolean | null>;

  constructor(private builder: FormBuilder, private store: Store<{ user: any }>) {
    this.signupForm = this.builder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(5)]],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required]
    });

    this.isEmailDuplicate$ = this.store.pipe(select(state => state.user.isEmailDuplicate));
  }

  signup() {
    if (this.signupForm.invalid) {
      this.formError = 'Please fill in all required fields correctly.';
      return;
    }

    const { email, password, firstName, lastName } = this.signupForm.value;
    this.store.dispatch(UserActions.signup({ email, password, firstName, lastName }));
  }

  onEmailBlur() {
    const emailControl = this.signupForm.get('email');
    if (emailControl && emailControl.valid) {
      this.store.dispatch(UserActions.checkEmail({ email: emailControl.value }));
      this.isEmailDuplicate$.subscribe(isDuplicate => {
        if (isDuplicate) {
          emailControl.setErrors({ duplicate: true });
        }
        else {
          emailControl.setErrors(null);
        }
      });
    }
  }

  dismissAlert() {
    this.formError = null;
  }
}
