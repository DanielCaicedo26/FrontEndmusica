import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';

@Component({
  selector: 'app-song-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './song-form.component.html',
  styleUrls: ['./song-form.component.scss']
})
export class SongFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  songForm: FormGroup;
  isEditMode = false;

  constructor() {
    this.songForm = this.fb.group({
      title: ['', Validators.required],
      duration: ['']
    });
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) this.isEditMode = true;
  }

  onSubmit(): void {
    if (this.songForm.invalid) {
      this.songForm.markAllAsTouched();
      return;
    }
    this.router.navigate(['/songs']);
  }
}
