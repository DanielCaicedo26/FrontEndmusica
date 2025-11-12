import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseApiService } from './base-api.service';
import { Person, CreatePersonRequest, UpdatePersonRequest } from '@core/models';

@Injectable({ providedIn: 'root' })
export class PersonService extends BaseApiService<Person> {
  constructor() {
    super('Person');
  }

  createPerson(request: CreatePersonRequest): Observable<Person> {
    return this.create(request as any);
  }

  updatePerson(id: number, request: UpdatePersonRequest): Observable<Person> {
    return this.update(id, request as any);
  }
}
