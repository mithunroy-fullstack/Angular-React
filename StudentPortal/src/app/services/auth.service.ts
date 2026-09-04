import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

interface LoginResponse {
  token: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = '/api/auth';

  constructor(private http: HttpClient) {}

  // Login API
  login(credentials: { email: string; password: string }): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(
      `${this.apiUrl}/login`,
      credentials
    );
  }

  // Get role from JWT
  getRoleFromToken(token: string): string {

    try {

      // JWT has 3 parts:
      // Header.Payload.Signature
      const payloadBase64 = token.split('.')[1];

      // Decode payload
      const payloadJson = atob(payloadBase64);

      // Convert JSON string to object
      const payload = JSON.parse(payloadJson);

      console.log('JWT Payload:', payload);

      // ASP.NET Core ClaimTypes.Role
      const roleClaim =
        'http://schemas.microsoft.com/ws/2008/06/identity/claims/role';

      // ASP.NET Core may serialize one role as a string or multiple roles as an array.
      const roles = payload[roleClaim] || payload['role'] || [];
      return Array.isArray(roles) ? roles[0] || '' : roles;

    } catch (error) {

      console.error('Error decoding JWT:', error);

      return '';
    }
  }
}