import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  private readonly apiUrl = `${environment.apiUrl}/api/v1/auth`;
  

  constructor(private httpClient: HttpClient) { }

  public login(email: string, password: string): Observable<any> {
    const loginData = { email, password };
    return this.httpClient.post(`${this.apiUrl}/login`, loginData);
  }

}
