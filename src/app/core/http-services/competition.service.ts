import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpService } from './http.service';

export interface CompetitionDefinitionRequest {
  competitionTitle: string | null;
  competitionDate: string;
  competitionAddress: string | null;
  licenseFileId: number | null;
  bannerFileId: number | null;
}

export interface CompetitionParam {
  key: string | null;
  title: string | null;
  values: CompetitionParamValue[] | null;
}

export interface CompetitionParamValue {
  key: string | null;
  title: string | null;
  params: CompetitionParam[] | null;
}

@Injectable({
  providedIn: 'root'
})
export class CompetitionService {
  constructor(private http: HttpService) {}

  getCompetitions(): Observable<any> {
    return this.http.get('/api/Competition');
  }

  getCompetitionById(id: number): Observable<any> {
    return this.http.get(`/api/Competition/${id}`);
  }

  createCompetition(data: CompetitionDefinitionRequest): Observable<any> {
    return this.http.post('/api/Competition', data);
  }

  updateCompetitionParams(id: number, params: CompetitionParam): Observable<any> {
    return this.http.put(`/api/Competition/params/${id}`, params);
  }

  startRegistration(id: number): Observable<any> {
    return this.http.patch(`/api/Competition/start-registration/${id}`);
  }

  changeVisibility(id: number): Observable<any> {
    return this.http.patch(`/api/Competition/change-visibility/${id}`);
  }

  changeRegistrationStatus(id: number): Observable<any> {
    return this.http.patch(`/api/Competition/change-registration-status/${id}`);
  }
}
