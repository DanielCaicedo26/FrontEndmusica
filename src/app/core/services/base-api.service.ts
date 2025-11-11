import { HttpClient, HttpParams } from '@angular/common/http';
import { inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '@environments/environment';

export abstract class BaseApiService<T> {
  protected http = inject(HttpClient);
  protected baseUrl = environment.apiUrl;

  constructor(protected endpoint: string) {}

  getAll(params?: any): Observable<T[]> {
    let httpParams = new HttpParams();
    if (params) {
      Object.keys(params).forEach(key => {
        if (params[key] != null) {
          httpParams = httpParams.set(key, params[key].toString());
        }
      });
    }
    return this.http.get<T[]>(`${this.baseUrl}/${this.endpoint}`, { params: httpParams });
  }

  getById(id: number): Observable<T> {
    return this.http.get<T>(`${this.baseUrl}/${this.endpoint}/${id}`);
  }

  create(data: Partial<T>): Observable<any> {
    return this.http.post(`${this.baseUrl}/${this.endpoint}`, data);
  }

  update(id: number, data: Partial<T>): Observable<any> {
    return this.http.put(`${this.baseUrl}/${this.endpoint}/${id}`, data);
  }

  delete(id: number, deleteType: 'Persistent' | 'Logical' = 'Logical'): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${this.endpoint}/${id}`, {
      params: { deleteType }
    });
  }

  restore(id: number): Observable<any> {
    return this.http.patch(`${this.baseUrl}/${this.endpoint}/logical-restore/${id}`, {});
  }
}
