import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AlbumService, ArtistService } from '@core/services';
import { Album, CreateAlbumDto, Artist } from '@core/models';

@Component({
  selector: 'app-album-list',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule],
  templateUrl: './album-list.component.html',
  styleUrls: ['./album-list.component.scss']
})
export class AlbumListComponent implements OnInit {
  private albumService = inject(AlbumService);
  private artistService = inject(ArtistService);
  private fb = inject(FormBuilder);

  albums = signal<Album[]>([]);
  artists = signal<Artist[]>([]);
  isLoading = signal(true);
  errorMessage = signal('');
  showModal = signal(false);
  isSaving = signal(false);
  isEditMode = signal(false);
  editingAlbumId = signal<number | null>(null);

  albumForm: FormGroup;

  constructor() {
    this.albumForm = this.fb.group({
      name: ['', [Validators.required]],
      description: ['', [Validators.required]],
      releaseDate: ['', [Validators.required]],
      coverImageUrl: ['', [Validators.required]],
      artistId: [null, [Validators.required, Validators.min(1)]]
    });
  }

  ngOnInit(): void {
    this.loadAlbums();
    this.loadArtists();
  }

  loadAlbums(): void {
    this.isLoading.set(true);
    this.errorMessage.set('');
    this.albumService.getAll().subscribe({
      next: (data) => {
        this.albums.set(data || []);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Error loading albums', err);
        this.errorMessage.set(err?.message || 'Error cargando álbumes');
        this.isLoading.set(false);
      }
    });
  }

  loadArtists(): void {
    this.artistService.getAll().subscribe({
      next: (data) => {
        this.artists.set(data || []);
      },
      error: (err) => {
        console.error('Error loading artists', err);
      }
    });
  }

  openModal(): void {
    this.isEditMode.set(false);
    this.editingAlbumId.set(null);
    this.showModal.set(true);
    this.albumForm.reset();
  }

  openEditModal(album: Album): void {
    this.isEditMode.set(true);
    this.editingAlbumId.set(album.id);
    this.showModal.set(true);
    
    // Formatear la fecha para el input type="date"
    const releaseDate = album.releaseDate 
      ? new Date(album.releaseDate).toISOString().split('T')[0]
      : '';

    this.albumForm.patchValue({
      name: album.name,
      description: album.description,
      releaseDate: releaseDate,
      coverImageUrl: album.coverImageUrl,
      artistId: album.artistId
    });
  }

  closeModal(): void {
    this.showModal.set(false);
    this.isEditMode.set(false);
    this.editingAlbumId.set(null);
    this.albumForm.reset();
  }

  onSubmit(): void {
    if (this.albumForm.invalid) {
      this.albumForm.markAllAsTouched();
      return;
    }

    this.isSaving.set(true);

    // Convertir fecha a formato ISO si es necesario
    const releaseDateValue = this.albumForm.value.releaseDate;
    const releaseDateISO = releaseDateValue.includes('T')
      ? releaseDateValue
      : new Date(releaseDateValue + 'T00:00:00.000Z').toISOString();

    const albumData: CreateAlbumDto = {
      id: this.editingAlbumId() || 0,
      name: this.albumForm.value.name,
      description: this.albumForm.value.description,
      releaseDate: releaseDateISO,
      coverImageUrl: this.albumForm.value.coverImageUrl,
      artistId: Number(this.albumForm.value.artistId)
    };

    if (this.isEditMode() && this.editingAlbumId()) {
      // Modo edición
      this.albumService.update(this.editingAlbumId()!, albumData).subscribe({
        next: () => {
          this.isSaving.set(false);
          this.closeModal();
          this.loadAlbums();
        },
        error: (err) => {
          console.error('Error updating album', err);
          this.errorMessage.set(err?.message || 'Error al actualizar el álbum');
          this.isSaving.set(false);
        }
      });
    } else {
      // Modo creación
      this.albumService.create(albumData).subscribe({
        next: () => {
          this.isSaving.set(false);
          this.closeModal();
          this.loadAlbums();
        },
        error: (err) => {
          console.error('Error creating album', err);
          this.errorMessage.set(err?.message || 'Error al crear el álbum');
          this.isSaving.set(false);
        }
      });
    }
  }
}
