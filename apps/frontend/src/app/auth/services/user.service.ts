import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = '/api/user';

  constructor(private http: HttpClient) {}

  signup(user: { email: string; password: string; firstName: string; lastName: string }): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/signup`, user);
  }

  checkEmail(email: string): Observable<{ isDuplicate: boolean }> {
    return this.http.get<{ isDuplicate: boolean }>(`${this.apiUrl}/check-email?email=${email}`);
  }
}
