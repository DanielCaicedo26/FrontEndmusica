import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';

@Component({
  selector: 'app-genre-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './genre-form.component.html',
  styleUrls: ['./genre-form.component.scss']
})
export class GenreFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  genreForm: FormGroup;
  isEditMode = false;

  constructor() {
    this.genreForm = this.fb.group({
      name: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) this.isEditMode = true;
  }

  onSubmit(): void {
    if (this.genreForm.invalid) {
      this.genreForm.markAllAsTouched();
      return;
    }
    this.router.navigate(['/genres']);
  }
}
