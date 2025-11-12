import { BaseModel } from './base.model';
import { Song } from './song.model';
import { Playlist } from './playlist.model';

export interface PlaylistSong extends BaseModel {
    playlistId: number;
    songId: number;
    orderIndex: number;
    playlist?: Playlist;
    song?: Song;
}

export interface CreatePlaylistSongRequest {
    playlistId: number;
    songId: number;
    orderIndex: number;
}

export interface UpdatePlaylistSongRequest {
    playlistId?: number;
    songId?: number;
    orderIndex?: number;
}
