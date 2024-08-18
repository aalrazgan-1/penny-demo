import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Store } from '@ngrx/store';
import * as AuthActions from './auth/state/auth.actions';

@Component({
  standalone: true,
  imports: [RouterModule],
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  constructor(private store: Store<{ auth: any }>) {}
  
  ngOnInit(): void {
    const token = localStorage.getItem('token');
    const tokenExpiry = localStorage.getItem('tokenExpiry');
    
    if (token && tokenExpiry) {
      const now = new Date().getTime();
      if (now < +tokenExpiry) {
        this.store.dispatch(AuthActions.loginSuccess({ token: token, expiresAt: tokenExpiry }));
      } else {
        this.store.dispatch(AuthActions.logout());
      }
    }
  }

  title = 'Penny Demo';
}

