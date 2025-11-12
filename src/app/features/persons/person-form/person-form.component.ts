import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { PersonService } from '@core/services/person.service';
import { Person } from '@core/models';

@Component({
  selector: 'app-person-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './person-form.component.html',
  styleUrls: ['./person-form.component.scss']
})
export class PersonFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private personService = inject(PersonService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  personForm!: FormGroup;
  isEditMode = signal(false);
  personId = signal<number | null>(null);
  isLoading = signal(false);
  isSaving = signal(false);
  errorMessage = signal('');

  ngOnInit() {
    this.initForm();
    this.checkEditMode();
  }

  private initForm() {
    this.personForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      identification: ['', [Validators.required, Validators.minLength(5)]],
      phoneNumber: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
      address: ['', [Validators.required, Validators.minLength(5)]]
    });
  }

  private checkEditMode() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode.set(true);
      this.personId.set(+id);
      this.loadPerson(+id);
    }
  }

  private loadPerson(id: number) {
    this.isLoading.set(true);
    this.personService.getById(id).subscribe({
      next: (person) => {
        this.personForm.patchValue({
          firstName: person.firstName,
          lastName: person.lastName,
          identification: person.identification,
          phoneNumber: person.phoneNumber,
          address: person.address
        });
        this.isLoading.set(false);
      },
      error: (error) => {
        console.error('Error loading person:', error);
        this.errorMessage.set('Error al cargar persona');
        this.isLoading.set(false);
      }
    });
  }

  onSubmit() {
    if (this.personForm.invalid) {
      Object.keys(this.personForm.controls).forEach(key => {
        this.personForm.get(key)?.markAsTouched();
      });
      return;
    }

    this.isSaving.set(true);
    this.errorMessage.set('');

    const formData = this.personForm.value;

    if (this.isEditMode()) {
      this.personService.updatePerson(this.personId()!, formData).subscribe({
        next: () => {
          this.router.navigate(['/persons']);
        },
        error: (error) => {
          console.error('Error updating person:', error);
          this.errorMessage.set(error.error?.message || 'Error al actualizar persona');
          this.isSaving.set(false);
        }
      });
    } else {
      this.personService.createPerson(formData).subscribe({
        next: () => {
          this.router.navigate(['/persons']);
        },
        error: (error) => {
          console.error('Error creating person:', error);
          this.errorMessage.set(error.error?.message || 'Error al crear persona');
          this.isSaving.set(false);
        }
      });
    }
  }
}
