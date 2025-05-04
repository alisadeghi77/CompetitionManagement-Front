import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpService } from './http.service';

@Injectable({
  providedIn: 'root'
})
export class BracketService {
  constructor(private http: HttpService) {}

  getBracketsReport(bracketId: number): Observable<any> {
    return this.http.get(`/api/Bracket/brackets-report/${bracketId}`);
  }


  getBracketsKeysByCompetionId(competitionId: number): Observable<any> {
    return this.http.get(`/api/Bracket/available-keys/${competitionId}`);
  }

  getCoachScoreReport(bracketId: number): Observable<any> {
    return this.http.get(`/api/Bracket/coach-score-report/${bracketId}`);
  }

  createBracket(competitionId: number): Observable<any> {
    return this.http.post(`/api/Bracket/${competitionId}`, {});
  }

  deleteBracket(competitionId: number): Observable<any> {
    return this.http.delete(`/api/Bracket/${competitionId}`);
  }

  createBracketWithKey(competitionId: number, bracketKey: string): Observable<any> {
    return this.http.post(`/api/Bracket/${competitionId}/${bracketKey}`, {});
  }

  deleteBracketWithKey(competitionId: number, bracketKey: string): Observable<any> {
    return this.http.delete(`/api/Bracket/${competitionId}/${bracketKey}`);
  }
}
