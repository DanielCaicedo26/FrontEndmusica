import { Injectable } from '@angular/core';
import { BaseApiService } from './base-api.service';
import { Artist } from '@core/models';

@Injectable({ providedIn: 'root' })
export class ArtistService extends BaseApiService<Artist> {
  constructor() {
    super('artist');
  }
}
