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
    // Check for existing token and user data
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    if (token && user) {
      this.currentUserSubject.next(JSON.parse(user));
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

  setToken(token: string): void {
    localStorage.setItem('token', token);
  }

  setUser(user: any): void {
    localStorage.setItem('user', JSON.stringify(user));
    this.currentUserSubject.next(user);
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.currentUserSubject.next(null);
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('token');
  }
}
