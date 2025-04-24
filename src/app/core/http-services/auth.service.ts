import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpService } from './http.service';

export interface LoginCommand {
  phoneNumber: string | null;
}

export interface VerifyCommand {
  phoneNumber: string | null;
  otpCode: string | null;
}

export interface RegisterRequest {
  phoneNumber: string | null;
  firstName: string | null;
  lastName: string | null;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<any>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpService) {
    const userName = localStorage.getItem('userName');
    const fullName = localStorage.getItem('fullName');
    if (userName && fullName) {
      this.currentUserSubject.next({ userName, fullName });

    }
  }

  login(phoneNumber: string): Observable<any> {
    const command: LoginCommand = { phoneNumber };
    return this.http.post('/api/Auth/login', command);
  }

  verify(phoneNumber: string, otpCode: string): Observable<any> {
    const command: VerifyCommand = { phoneNumber, otpCode };
    return this.http.post('/api/Auth/verify', command);
  }

  getCurrentUser(): Observable<any> {
    return this.http.get('/api/Auth/me');
  }

  registerCoach(data: RegisterRequest): Observable<any> {
    return this.http.put('/api/User/Coach', data);
  }

  registerPlanner(data: RegisterRequest): Observable<any> {
    return this.http.post('/api/User/Planner', data);
  }

  registerParticipant(data: RegisterRequest): Observable<any> {
    return this.http.post('/api/User/Participant', data);
  }

  setUserLogin(token: string, userName: string, fullName: string): void {

    try {
      localStorage.setItem('token', token);
      localStorage.setItem('userName', userName);
      localStorage.setItem('fullName', fullName);
      localStorage.setItem('role', this.getRoleClaim(token));

      this.currentUserSubject.next({ userName, fullName });

    } catch (error) {
      this.currentUserSubject.next(null);
      console.error('دوباره تلاش کنید', error);
    }

  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('userName');
    localStorage.removeItem('fullName');
    localStorage.removeItem('role');
    this.currentUserSubject.next(null);
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('token');
  }

  private getRoleClaim(token: string): string {
    const [, payloadBase64] = token.split('.');
    const payloadJson = atob(payloadBase64.replace(/-/g, '+').replace(/_/g, '/'));
    const payload = JSON.parse(payloadJson);
    const roleClaim = payload["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
    return roleClaim;
  }
}
