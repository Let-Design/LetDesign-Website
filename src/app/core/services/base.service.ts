import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class BaseService {
  protected BACKEND_URL = 'http://localhost:4200/api';
  constructor(protected http: HttpClient) {}

  protected get<T>(endpoint: string, headers?: HttpHeaders): Observable<T> {
    return this.http
      .get<T>(`${this.BACKEND_URL}/${endpoint}`, { headers })
      .pipe(catchError(this.handleError));
  }

  protected post<T>(
    endpoint: string,
    body: any,
    headers?: HttpHeaders
  ): Observable<T> {
    return this.http
      .post<T>(`${this.BACKEND_URL}/${endpoint}`, body, { headers })
      .pipe(catchError(this.handleError));
  }

  protected put<T>(
    endpoint: string,
    body: any,
    headers?: HttpHeaders
  ): Observable<T> {
    return this.http
      .put<T>(`${this.BACKEND_URL}/${endpoint}`, body, { headers })
      .pipe(catchError(this.handleError));
  }

  protected delete<T>(endpoint: string, headers?: HttpHeaders): Observable<T> {
    return this.http
      .delete<T>(`${this.BACKEND_URL}/${endpoint}`, { headers })
      .pipe(catchError(this.handleError));
  }

  protected handleError(error: any) {
    console.error(`API Error: ${error}`);
    return throwError(() => new Error(error.message || 'Something went wrong'));
  }
}
