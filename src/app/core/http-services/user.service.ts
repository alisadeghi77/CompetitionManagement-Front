import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpService } from './http.service';

export interface RegisterRequest {
  phoneNumber: string | null;
  firstName: string | null;
  lastName: string | null;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(private http: HttpService) {}

  getCoaches(phoneNumber?: string): Observable<any> {
    return this.http.get('/api/User/Coaches', { phoneNumber });
  }

  registerPlanner(data: RegisterRequest): Observable<any> {
    return this.http.post('/api/User/Planner', data);
  }

  registerParticipant(data: RegisterRequest): Observable<any> {
    return this.http.post('/api/User/Participant', data);
  }
}
