import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment.development';
import { LoginResponse } from './models/login-response.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly apiUrl = `${environment.apiUrl}/auth`;

  constructor(private httpClient: HttpClient) { }

  public login(email: string, password: string): Observable<LoginResponse> {
    const loginData = { email, password };
    return this.httpClient.post<LoginResponse>(`${this.apiUrl}/login`, loginData);
  }

  public getAccessToken(): string | null {
    return localStorage.getItem('accessToken');
  }

  public getExpiresAtUtc(): Date | null {
    const expiresAtUtcString = localStorage.getItem('expiresAtUtc');
    return expiresAtUtcString ? new Date(expiresAtUtcString) : null;
  }

  public isAuthenticated(): boolean {
    const accessToken = this.getAccessToken();
    const expiresAtUtc = this.getExpiresAtUtc();

    if (!accessToken || !expiresAtUtc) {
      return false;
    }

    const now = new Date();
    return now < expiresAtUtc;
  }

  public setSession(accessToken: string, expiresAtUtc: string): void {
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('expiresAtUtc', expiresAtUtc);
  }

  public logout(): void {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('expiresAtUtc');
  }

  public get getUserId(): number | null {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      return null;
    }
    const payload = JSON.parse(atob(token.split('.')[1]));
    const userId = payload.sub != null ? Number(payload.sub) : null;
    return userId;
  }
}
