import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { GenreService } from '@core/services';
import { Genre } from '@core/models';

@Component({
  selector: 'app-genre-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './genre-list.component.html',
  styleUrls: ['./genre-list.component.scss']
})
export class GenreListComponent implements OnInit {
  private genreService = inject(GenreService);

  genres = signal<Genre[]>([]);
  isLoading = signal(true);
  errorMessage = signal<string>('');

  ngOnInit(): void {
    this.loadGenres();
  }

  loadGenres(): void {
    this.isLoading.set(true);
    this.genreService.getAll().subscribe({
      next: (genres) => {
        this.genres.set(genres);
        this.isLoading.set(false);
      },
      error: (error) => {
        this.errorMessage.set(error.message);
        this.isLoading.set(false);
      }
    });
  }

  deleteGenre(id: number): void {
    if (!confirm('Are you sure?')) return;

    this.genreService.delete(id).subscribe({
      next: () => this.loadGenres(),
      error: (error) => alert('Error: ' + error.message)
    });
  }
}
