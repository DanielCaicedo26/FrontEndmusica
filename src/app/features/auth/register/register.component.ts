import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '@core/services';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  private fb: FormBuilder = inject(FormBuilder);
  private authService: AuthService = inject(AuthService);
  private router: Router = inject(Router);

  registerForm: FormGroup;
  isLoading = signal(false);
  errorMessage = signal<string>('');

  constructor() {
    this.registerForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      identification: ['', Validators.required],
      phoneNumber: ['', Validators.required],
      address: ['', Validators.required],
      birthDate: ['']
    });
  }

  onSubmit(): void {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    // Validate passwords match
    const pw = this.registerForm.get('password')!.value;
    const cpw = this.registerForm.get('confirmPassword')!.value;
    if (pw !== cpw) {
      this.errorMessage.set('Passwords do not match');
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set('');

    // Prepare payload matching backend `RegisterRequest` model
    const values = this.registerForm.value as any;
    // Build payload matching backend's expected property names (PascalCase)
    const payload = {
      Email: values.email,
      Password: values.password,
      ConfirmPassword: values.confirmPassword,
      FirstName: values.firstName,
      LastName: values.lastName,
      Identification: values.identification,
      PhoneNumber: values.phoneNumber,
      Address: values.address,
      BirthDate: values.birthDate ? new Date(values.birthDate).toISOString() : undefined
    };

    this.authService.register(payload as any).subscribe({
      next: () => this.router.navigate(['/dashboard']),
      error: (error) => {
        // Parse validation errors from backend if present
        const serverError = (error as any).error;
        let serverMsg = 'Registration failed';
        if (serverError) {
          if (serverError.errors) {
            // Flatten errors into a readable string
            const parts: string[] = [];
            for (const key of Object.keys(serverError.errors)) {
              const arr = serverError.errors[key];
              if (Array.isArray(arr)) parts.push(`${key}: ${arr.join(' | ')}`);
            }
            if (parts.length) serverMsg = parts.join('\n');
            else serverMsg = serverError.title || JSON.stringify(serverError);
          } else {
            serverMsg = serverError.message || JSON.stringify(serverError);
          }
        }
        this.errorMessage.set(serverMsg);
        this.isLoading.set(false);
      }
    });
  }
}
