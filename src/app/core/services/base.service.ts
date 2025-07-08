import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class BaseService {
  protected BACKEND_URL = 'http://localhost:8080/api';
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

  protected handleError(res: any) {
    // Best Options is to have a logger
    console.error('API Error: ', res);
    return throwError(
      () => new Error(res.error.message || 'Something went wrong')
    );
  }
}
