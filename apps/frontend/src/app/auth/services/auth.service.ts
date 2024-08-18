import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'apps/frontend/src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}/auth`;

  constructor(private http: HttpClient) {}

  login(email: string, password: string): Observable<{ access_token: string, expiresAt: any }> {
    return this.http.post<{ access_token: string, expiresAt: any }>(`${this.apiUrl}/login`, { email, password });
  }

  getProfile(): Observable<{ userId: string; email: string }> {
    return this.http.get<{ userId: string; email: string }>(`${this.apiUrl}/profile`);
  }
}
