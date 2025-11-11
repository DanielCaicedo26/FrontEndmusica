import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { PlaylistService } from '@core/services';
import { Playlist } from '@core/models';

@Component({
  selector: 'app-playlist-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './playlist-list.component.html',
  styleUrls: ['./playlist-list.component.scss']
})
export class PlaylistListComponent implements OnInit {
  private playlistService = inject(PlaylistService);

  playlists = signal<Playlist[]>([]);
  isLoading = signal(true);
  errorMessage = signal<string>('');

  ngOnInit(): void {
    this.loadPlaylists();
  }

  loadPlaylists(): void {
    this.isLoading.set(true);
    this.playlistService.getAll().subscribe({
      next: (playlists) => {
        this.playlists.set(playlists);
        this.isLoading.set(false);
      },
      error: (error) => {
        this.errorMessage.set(error.message);
        this.isLoading.set(false);
      }
    });
  }

  deletePlaylist(id: number): void {
    if (!confirm('Are you sure?')) return;

    this.playlistService.delete(id).subscribe({
      next: () => this.loadPlaylists(),
      error: (error) => alert('Error: ' + error.message)
    });
  }
}
