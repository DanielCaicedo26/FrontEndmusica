import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { PlaylistSongService } from '@core/services/playlist-song.service';
import { SongService } from '@core/services';
import { PlaylistService } from '@core/services';
import { PlaylistSong, Song, Playlist } from '@core/models';

@Component({
  selector: 'app-playlist-songs',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './playlist-songs.component.html',
  styleUrls: ['./playlist-songs.component.scss']
})
export class PlaylistSongsComponent implements OnInit {
  private playlistSongService = inject(PlaylistSongService);
  private songService = inject(SongService);
  private playlistService = inject(PlaylistService);
  private route = inject(ActivatedRoute);
  private fb = inject(FormBuilder);

  playlistId = signal<number>(0);
  playlist = signal<Playlist | null>(null);
  playlistSongs = signal<PlaylistSong[]>([]);
  availableSongs = signal<Song[]>([]);

  isLoading = signal(false);
  isLoadingSongs = signal(false);
  isSaving = signal(false);
  errorMessage = signal('');
  successMessage = signal('');

  showAddModal = signal(false);
  showDeleteModal = signal(false);
  selectedPlaylistSong = signal<PlaylistSong | null>(null);

  addSongForm!: FormGroup;

  ngOnInit() {
    this.initForm();
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.playlistId.set(+id);
      this.loadPlaylist(+id);
      this.loadPlaylistSongs(+id);
      this.loadAvailableSongs();
    }
  }

  private initForm() {
    this.addSongForm = this.fb.group({
      songId: [null, Validators.required],
      orderIndex: [0, [Validators.required, Validators.min(0)]]
    });
  }

  private loadPlaylist(id: number) {
    this.playlistService.getById(id).subscribe({
      next: (playlist) => {
        this.playlist.set(playlist);
      },
      error: (error) => {
        console.error('Error loading playlist:', error);
        this.errorMessage.set('Error al cargar playlist');
      }
    });
  }

  private loadPlaylistSongs(playlistId: number) {
    this.isLoading.set(true);
    this.playlistSongService.getByPlaylistId(playlistId).subscribe({
      next: (songs) => {
        this.playlistSongs.set(songs.sort((a, b) => a.orderIndex - b.orderIndex));
        this.isLoading.set(false);
      },
      error: (error) => {
        console.error('Error loading playlist songs:', error);
        this.errorMessage.set('Error al cargar canciones de la playlist');
        this.isLoading.set(false);
      }
    });
  }

  private loadAvailableSongs() {
    this.isLoadingSongs.set(true);
    this.songService.getAll().subscribe({
      next: (songs) => {
        this.availableSongs.set(songs);
        this.isLoadingSongs.set(false);
      },
      error: (error) => {
        console.error('Error loading songs:', error);
        this.isLoadingSongs.set(false);
      }
    });
  }

  openAddModal() {
    this.addSongForm.patchValue({
      orderIndex: this.playlistSongs().length
    });
    this.showAddModal.set(true);
  }

  closeAddModal() {
    this.showAddModal.set(false);
    this.addSongForm.reset({ orderIndex: 0 });
  }

  openDeleteModal(playlistSong: PlaylistSong) {
    this.selectedPlaylistSong.set(playlistSong);
    this.showDeleteModal.set(true);
  }

  closeDeleteModal() {
    this.showDeleteModal.set(false);
    this.selectedPlaylistSong.set(null);
  }

  onAddSong() {
    if (this.addSongForm.invalid) {
      Object.keys(this.addSongForm.controls).forEach(key => {
        this.addSongForm.get(key)?.markAsTouched();
      });
      return;
    }

    this.isSaving.set(true);
    this.errorMessage.set('');

    const formData = {
      ...this.addSongForm.value,
      playlistId: this.playlistId()
    };

    this.playlistSongService.createPlaylistSong(formData).subscribe({
      next: () => {
        this.successMessage.set('Canción agregada exitosamente');
        this.loadPlaylistSongs(this.playlistId());
        this.closeAddModal();
        this.isSaving.set(false);
        setTimeout(() => this.successMessage.set(''), 3000);
      },
      error: (error) => {
        console.error('Error adding song:', error);
        this.errorMessage.set('Error al agregar canción');
        this.isSaving.set(false);
        setTimeout(() => this.errorMessage.set(''), 3000);
      }
    });
  }

  confirmDelete() {
    const playlistSong = this.selectedPlaylistSong();
    if (!playlistSong) return;

    this.playlistSongService.delete(playlistSong.id).subscribe({
      next: () => {
        this.successMessage.set('Canción eliminada de la playlist');
        this.loadPlaylistSongs(this.playlistId());
        this.closeDeleteModal();
        setTimeout(() => this.successMessage.set(''), 3000);
      },
      error: (error) => {
        console.error('Error deleting playlist song:', error);
        this.errorMessage.set('Error al eliminar canción');
        this.closeDeleteModal();
        setTimeout(() => this.errorMessage.set(''), 3000);
      }
    });
  }

  getSongTitle(playlistSong: PlaylistSong): string {
    return playlistSong.song?.name || 'Canción desconocida';
  }

  getSongAlbumName(playlistSong: PlaylistSong): string {
    return playlistSong.song?.albumName || '-';
  }

  getSongDuration(playlistSong: PlaylistSong): string {
    const seconds = playlistSong.song?.durationSeconds;
    if (!seconds) return '-';
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  }
}
