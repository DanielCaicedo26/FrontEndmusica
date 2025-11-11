import { Injectable } from '@angular/core';
import { BaseApiService } from './base-api.service';
import { Genre } from '@core/models';

@Injectable({ providedIn: 'root' })
export class GenreService extends BaseApiService<Genre> {
  constructor() {
    super('genre');
  }
}
