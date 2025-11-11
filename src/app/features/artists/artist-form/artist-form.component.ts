import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { ArtistService } from '@core/services';

@Component({
  selector: 'app-artist-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './artist-form.component.html',
  styleUrls: ['./artist-form.component.scss']
})
export class ArtistFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private artistService = inject(ArtistService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  artistForm: FormGroup;
  isLoading = signal(false);
  isEditMode = signal(false);
  artistId: number | null = null;

  constructor() {
    this.artistForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      country: ['', Validators.required],
      debutDate: ['']
    });
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode.set(true);
      this.artistId = +id;
      this.loadArtist(this.artistId);
    }
  }

  loadArtist(id: number): void {
    this.artistService.getById(id).subscribe({
      next: (artist) => this.artistForm.patchValue(artist),
      error: (error) => {
        alert('Error loading artist: ' + error.message);
        this.router.navigate(['/artists']);
      }
    });
  }

  onSubmit(): void {
    if (this.artistForm.invalid) {
      this.artistForm.markAllAsTouched();
      return;
    }

    this.isLoading.set(true);
    const operation = this.isEditMode()
      ? this.artistService.update(this.artistId!, this.artistForm.value)
      : this.artistService.create(this.artistForm.value);

    operation.subscribe({
      next: () => this.router.navigate(['/artists']),
      error: (error) => {
        alert('Error: ' + error.message);
        this.isLoading.set(false);
      }
    });
  }
}
