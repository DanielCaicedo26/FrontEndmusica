import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseApiService } from './base-api.service';
import { AppUser, CreateAppUserRequest, UpdateAppUserRequest } from '@core/models';

@Injectable({ providedIn: 'root' })
export class UserService extends BaseApiService<AppUser> {
  constructor() {
    super('users');
  }

  createUser(request: CreateAppUserRequest): Observable<AppUser> {
    return this.create(request as any);
  }

  updateUser(id: number, request: UpdateAppUserRequest): Observable<AppUser> {
    return this.update(id, request as any);
  }

  toggleUserStatus(id: number): Observable<AppUser> {
    return this.http.patch<AppUser>(`${this.baseUrl}/${id}/toggle-status`, {});
  }

  assignRoles(userId: number, roles: string[]): Observable<AppUser> {
    return this.http.post<AppUser>(`${this.baseUrl}/${userId}/roles`, { roles });
  }
}
