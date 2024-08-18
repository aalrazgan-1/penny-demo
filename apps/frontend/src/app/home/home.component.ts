import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { logout } from '../auth/state/auth.actions';
import { AuthService } from '../auth/services/auth.service';
import { Observer } from 'rxjs';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent implements OnInit {
  profile: { userId: string; email: string } | null = null;
  
  constructor(private authService: AuthService, private store: Store) {}

  ngOnInit(): void {
    const profileObserver: Observer<{ userId: string; email: string }> = {
      next: (data) => {
        this.profile = data;
      },
      error: (err) => {
        console.error('Failed to fetch profile', err);
      },
      complete: () => {
      },
    };

    this.authService.getProfile().subscribe(profileObserver);
  }

  onLogout() {
    this.store.dispatch(logout());
  }
}
