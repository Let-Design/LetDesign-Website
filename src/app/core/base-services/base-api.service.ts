import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';

export interface QueryParams{
  pageNumber: number;
  pageSize: number;
  rowCont: number;
  sorts: string;
  filters: string;
}

export interface SearchResult<T> {
  result: T;
  params: QueryParams;
}

export interface ShareDomain{
  id?: number;
}

export class BaseApiService<T extends ShareDomain> {
 constructor(private endpoint: string, private httpClient: HttpClient ) {
 }

 // api url should put it in setting json
 public getUrl = (): string => `apiUrl/${this.endpoint}`;

 public search(query: QueryParams): Observable<SearchResult<T>> {
   return this.httpClient.get<SearchResult<T>>(`${this.getUrl()}`,{
     headers: new HttpHeaders({
       'Accept': 'application/json',
     }),
     params: new HttpParams()
       .append('pageSize', query.pageSize)
       .append('sort', `${query.sorts ?? ''}`)
       .append('filters', `${query.filters ?? ''}`)
   });
 }

 public find(id: number): Observable<T>{
   return this.httpClient.get<T>(`${this.getUrl()}/${id}`, this.getHttpHeaders(id))
 }

 public add(model: T): Observable<T>{
   return this.httpClient.post<T>(`${this.getUrl()}/${model}`, model)
 }

 public edit(model: T): Observable<T>{
   return this.httpClient.put<T>(`${this.getUrl()}/${model.id}`, model)
 }

 public delete(model: T): Observable<T>{
   const data= {
     headers: new HttpHeaders({
       'Accept': 'application/json',
     }),
     body: model
   }
   // example: model: id, note
   return this.httpClient.delete<T>(`${this.getUrl()}/${model.id}`,data)
 }

 public getHttpHeaders(param: any) : object{
   return {
     headers: new HttpHeaders({
       'Accept': 'application/json',
     }),
     params: param
   }
 }
}
