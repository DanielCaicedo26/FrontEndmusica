import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { SongService } from '@core/services';
import { Song } from '@core/models';

@Component({
  selector: 'app-song-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './song-list.component.html',
  styleUrls: ['./song-list.component.scss']
})
export class SongListComponent implements OnInit {
  private songService = inject(SongService);

  songs = signal<Song[]>([]);
  isLoading = signal(true);
  errorMessage = signal<string>('');

  ngOnInit(): void {
    this.loadSongs();
  }

  loadSongs(): void {
    this.isLoading.set(true);
    this.songService.getAll().subscribe({
      next: (songs) => {
        this.songs.set(songs);
        this.isLoading.set(false);
      },
      error: (error) => {
        this.errorMessage.set(error.message);
        this.isLoading.set(false);
      }
    });
  }

  deleteSong(id: number): void {
    if (!confirm('Are you sure?')) return;

    this.songService.delete(id).subscribe({
      next: () => this.loadSongs(),
      error: (error) => alert('Error: ' + error.message)
    });
  }

  formatDuration(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  }
}
