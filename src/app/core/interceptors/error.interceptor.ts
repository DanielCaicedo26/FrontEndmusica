import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '@core/services';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const authService = inject(AuthService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      let errorMessage = 'An error occurred';

      if (error.error instanceof ErrorEvent) {
        errorMessage = error.error.message;
      } else {
        switch (error.status) {
          case 401:
            errorMessage = 'Unauthorized';
            authService.logout();
            break;
          case 403:
            errorMessage = 'Forbidden';
            router.navigate(['/dashboard']);
            break;
          case 404:
            errorMessage = 'Not found';
            break;
          case 500:
            errorMessage = error.error?.message || 'Server error';
            break;
          default:
            errorMessage = error.error?.message || error.message;
        }
      }

      console.error('HTTP Error:', errorMessage);
      return throwError(() => new Error(errorMessage));
    })
  );
};
