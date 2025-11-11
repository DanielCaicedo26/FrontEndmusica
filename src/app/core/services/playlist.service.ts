import { Injectable } from '@angular/core';
import { BaseApiService } from './base-api.service';
import { Playlist } from '@core/models';

@Injectable({ providedIn: 'root' })
export class PlaylistService extends BaseApiService<Playlist> {
  constructor() {
    super('playlist');
  }
}
