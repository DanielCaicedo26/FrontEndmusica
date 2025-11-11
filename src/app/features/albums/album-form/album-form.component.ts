import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { AlbumService } from '../../../core/services/album.service';
import { ArtistService } from '../../../core/services/artist.service';
import { Artist } from '../../../core/models/artist.model';
import { CreateAlbumDto } from '../../../core/models/album.model';

@Component({
  selector: 'app-album-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './album-form.component.html',
  styleUrls: ['./album-form.component.scss']
})
export class AlbumFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private albumService = inject(AlbumService);
  private artistService = inject(ArtistService);

  albumForm: FormGroup;
  isEditMode = false;
  albumId: number | null = null;
  artists: Artist[] = [];

  constructor() {
    this.albumForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      releaseDate: ['', Validators.required],
      coverImageUrl: ['', Validators.required],
      artistId: [null, Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadArtists();
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.albumId = +id;
      this.albumService.getById(this.albumId).subscribe(album => {
        if (album) {
          // The API might return releaseDate as a string, ensure it's in 'yyyy-MM-dd' format for the input
          const releaseDate = new Date(album.releaseDate).toISOString().split('T')[0];
          this.albumForm.patchValue({ ...album, releaseDate });
        }
      });
    }
  }

  loadArtists(): void {
    this.artistService.getAll().subscribe(artists => {
      this.artists = artists;
    });
  }

  onSubmit(): void {
    if (this.albumForm.invalid) {
      this.albumForm.markAllAsTouched();
      return;
    }

    const formValue = this.albumForm.value;
    const albumDto: CreateAlbumDto = {
      name: formValue.name,
      description: formValue.description,
      releaseDate: formValue.releaseDate,
      coverImageUrl: formValue.coverImageUrl,
      artistId: formValue.artistId
    };

    if (this.isEditMode && this.albumId) {
      this.albumService.update(this.albumId, albumDto).subscribe(() => {
        this.router.navigate(['/albums']);
      });
    } else {
      this.albumService.create(albumDto).subscribe(() => {
        this.router.navigate(['/albums']);
      });
    }
  }
}
