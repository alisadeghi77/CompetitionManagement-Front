import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpService } from './http.service';

export interface MatchWinnerRequest {
  matchId: string;
  participantId: number;
}

@Injectable({
  providedIn: 'root'
})
export class MatchService {
  constructor(private http: HttpService) {}

  setMatchWinner(data: MatchWinnerRequest): Observable<any> {
    return this.http.post('/api/Match', data);
  }


  getBracketMatches(bracketKey: string): Observable<any> {
    return this.http.get(`/api/Match/${bracketKey}`);
  }
}
