import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpService } from './http.service';

export interface RegisterParticipantRequest {
  coachId: string | null;
  coachPhoneNumber: string | null;
  competitionId: number;
  params: { [key: string]: string }[] | null;
}

@Injectable({
  providedIn: 'root'
})
export class ParticipantService {
  constructor(private http: HttpService) {}

  getParticipants(): Observable<any> {
    return this.http.get('/api/Participant');
  }

  registerParticipant(data: RegisterParticipantRequest): Observable<any> {
    return this.http.post('/api/Participant', data);
  }

  approveParticipant(participantId: string): Observable<any> {
    return this.http.patch(`/api/Participant/approve/${participantId}`);
  }

  rejectParticipant(participantId: string): Observable<any> {
    return this.http.patch(`/api/Participant/reject/${participantId}`);
  }
}
