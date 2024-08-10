import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { logout } from '../auth/state/auth.actions';
import { AuthService } from '../auth/services/auth.service';

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
    this.authService.getProfile().subscribe(
      (data) => {
        this.profile = data;
      },
      (error) => {
        console.error('Failed to fetch profile', error);
      }
    );
  }

  onLogout() {
    this.store.dispatch(logout());
  }
}
