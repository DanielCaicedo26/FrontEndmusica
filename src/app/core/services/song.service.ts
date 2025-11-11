import { Injectable } from '@angular/core';
import { BaseApiService } from './base-api.service';
import { Song } from '@core/models';

@Injectable({ providedIn: 'root' })
export class SongService extends BaseApiService<Song> {
  constructor() {
    super('song');
  }
}
