import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseApiService } from './base-api.service';
import { PlaylistSong, CreatePlaylistSongRequest, UpdatePlaylistSongRequest } from '@core/models';

@Injectable({ providedIn: 'root' })
export class PlaylistSongService extends BaseApiService<PlaylistSong> {
  constructor() {
    super('PlaylistSong');
  }

  createPlaylistSong(request: CreatePlaylistSongRequest): Observable<PlaylistSong> {
    return this.create(request as any);
  }

  updatePlaylistSong(id: number, request: UpdatePlaylistSongRequest): Observable<PlaylistSong> {
    return this.update(id, request as any);
  }

  getByPlaylistId(playlistId: number): Observable<PlaylistSong[]> {
    // Prueba sin parámetro de expansión primero
    // Si el backend ya incluye las relaciones automáticamente, debería funcionar
    return this.http.get<PlaylistSong[]>(
      `${this.baseUrl}/${this.endpoint}?playlistId=${playlistId}`
    );
  }

  reorderSongs(playlistId: number, songOrders: { id: number; orderIndex: number }[]): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/${this.endpoint}/reorder`, { playlistId, songOrders });
  }
}
