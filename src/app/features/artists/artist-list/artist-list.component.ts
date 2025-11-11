import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ArtistService } from '@core/services';
import { Artist } from '@core/models';

@Component({
  selector: 'app-artist-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './artist-list.component.html',
  styleUrls: ['./artist-list.component.scss']
})
export class ArtistListComponent implements OnInit {
  private artistService = inject(ArtistService);

  artists = signal<Artist[]>([]);
  isLoading = signal(true);
  errorMessage = signal<string>('');

  ngOnInit(): void {
    this.loadArtists();
  }

  loadArtists(): void {
    this.isLoading.set(true);
    this.artistService.getAll().subscribe({
      next: (artists) => {
        this.artists.set(artists);
        this.isLoading.set(false);
      },
      error: (error) => {
        this.errorMessage.set(error.message);
        this.isLoading.set(false);
      }
    });
  }

  deleteArtist(id: number): void {
    if (!confirm('Are you sure?')) return;

    this.artistService.delete(id).subscribe({
      next: () => this.loadArtists(),
      error: (error) => alert('Error: ' + error.message)
    });
  }
}
