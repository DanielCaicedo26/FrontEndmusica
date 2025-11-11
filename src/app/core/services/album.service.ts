import { Injectable } from '@angular/core';
import { BaseApiService } from './base-api.service';
import { Album } from '@core/models';

@Injectable({ providedIn: 'root' })
export class AlbumService extends BaseApiService<Album> {
  constructor() {
    // backend endpoint for albums
    super('Album');
  }
}
