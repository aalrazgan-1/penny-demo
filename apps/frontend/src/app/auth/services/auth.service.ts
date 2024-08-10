import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = '/api/auth';

  constructor(private http: HttpClient) {}

  signup(user: { email: string; password: string; firstName: string; lastName: string }): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/signup`, user);
  }

  login(email: string, password: string): Observable<{ access_token: string, expiresAt: any }> {
    return this.http.post<{ access_token: string, expiresAt: any }>(`${this.apiUrl}/login`, { email, password });
  }

  getProfile(): Observable<{ userId: string; email: string }> {
    return this.http.get<{ userId: string; email: string }>(`${this.apiUrl}/profile`);
  }

  checkEmail(email: string): Observable<{ isDuplicate: boolean }> {
    return this.http.get<{ isDuplicate: boolean }>(`${this.apiUrl}/check-email?email=${email}`);
  }
}
