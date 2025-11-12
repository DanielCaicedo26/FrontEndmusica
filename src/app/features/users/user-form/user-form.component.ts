import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { UserService } from '@core/services/user.service';
import { PersonService } from '@core/services/person.service';
import { AppUser, Person } from '@core/models';

@Component({
  selector: 'app-user-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.scss']
})
export class UserFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private userService = inject(UserService);
  private personService = inject(PersonService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  userForm!: FormGroup;
  isEditMode = signal(false);
  userId = signal<number | null>(null);
  isLoading = signal(false);
  isSaving = signal(false);
  errorMessage = signal('');

  persons = signal<Person[]>([]);
  isLoadingPersons = signal(false);

  ngOnInit() {
    this.initForm();
    this.loadPersons();
    this.checkEditMode();
  }

  private initForm() {
    this.userForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      personId: [null, [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    });
  }

  private loadPersons() {
    this.isLoadingPersons.set(true);
    this.personService.getAll().subscribe({
      next: (persons) => {
        this.persons.set(persons);
        this.isLoadingPersons.set(false);
      },
      error: (error) => {
        console.error('Error loading persons:', error);
        this.isLoadingPersons.set(false);
      }
    });
  }

  private checkEditMode() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode.set(true);
      this.userId.set(+id);
      this.loadUser(+id);
      // En modo edición, la contraseña es opcional
      this.userForm.get('password')?.clearValidators();
      this.userForm.get('confirmPassword')?.clearValidators();
      this.userForm.get('password')?.updateValueAndValidity();
      this.userForm.get('confirmPassword')?.updateValueAndValidity();
    }
  }

  private loadUser(id: number) {
    this.isLoading.set(true);
    this.userService.getById(id).subscribe({
      next: (user) => {
        this.userForm.patchValue({
          name: user.name,
          email: user.email,
          personId: user.personId
        });
        this.isLoading.set(false);
      },
      error: (error) => {
        console.error('Error loading user:', error);
        this.errorMessage.set('Error al cargar usuario');
        this.isLoading.set(false);
      }
    });
  }

  getPersonFullName(person: Person): string {
    return `${person.firstName} ${person.lastName}`;
  }

  onSubmit() {
    if (this.userForm.invalid) {
      Object.keys(this.userForm.controls).forEach(key => {
        this.userForm.get(key)?.markAsTouched();
      });
      return;
    }

    const { password, confirmPassword, ...formData } = this.userForm.value;

    // Validar contraseñas solo si se están ingresando
    if (password || confirmPassword) {
      if (password !== confirmPassword) {
        this.errorMessage.set('Las contraseñas no coinciden');
        return;
      }
    }

    this.isSaving.set(true);
    this.errorMessage.set('');

    if (this.isEditMode()) {
      const updateData = { ...formData };
      if (password) {
        (updateData as any).password = password;
      }

      this.userService.updateUser(this.userId()!, updateData).subscribe({
        next: () => {
          this.router.navigate(['/users']);
        },
        error: (error) => {
          console.error('Error updating user:', error);
          this.errorMessage.set(error.error?.message || 'Error al actualizar usuario');
          this.isSaving.set(false);
        }
      });
    } else {
      const createData = { ...formData, password };

      this.userService.createUser(createData).subscribe({
        next: () => {
          this.router.navigate(['/users']);
        },
        error: (error) => {
          console.error('Error creating user:', error);
          this.errorMessage.set(error.error?.message || 'Error al crear usuario');
          this.isSaving.set(false);
        }
      });
    }
  }
}
