import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpService } from './http.service';
import { HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class FileService {
  constructor(private http: HttpService) {}

  uploadFile(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);

    // Override the default headers for file upload
    const headers = new HttpHeaders();
    headers.append('Content-Type', 'multipart/form-data');

    return this.http.post('/api/Files/upload', formData);
  }

  getFileById(id: number): Observable<any> {
    return this.http.get(`/api/Files/${id}`);
  }

  getFileByFileName(fileName: string): Observable<any> {
    return this.http.get(`/api/Files/fileName/${fileName}`);
  }
}
