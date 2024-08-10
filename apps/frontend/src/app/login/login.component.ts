import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import * as AuthActions from '../auth/state/auth.actions';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule, 
    RouterModule,
    ReactiveFormsModule,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  loginform: FormGroup;
  formError: string | null = null;

  constructor(private builder: FormBuilder, private store: Store<{ auth: any }>) {
    this.loginform = this.builder.group({
      email: this.builder.control('', [Validators.required, Validators.email]),
      password: this.builder.control('', Validators.required),
    });
  }

  login() {
    if (this.loginform.invalid) {
      this.formError = "Please fill in the form correctly.";
      return;
    }

    const { email, password } = this.loginform.value;

    this.store.dispatch(AuthActions.login({ email, password }));

    // Handle the result locally 
    this.store.select('auth').subscribe(authState => {
      if (authState.error) {
        this.formError = 'Invalid email or password. Please try again.';
      } else {
        this.formError = null;
      }
    });
  }

  onBlur(field: string) {
    this.loginform.get(field)?.markAsTouched();
  }

  dismissAlert() {
    this.formError = null;
  }
}
