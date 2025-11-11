import { Routes } from '@angular/router';

export const GENRES_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./genre-list/genre-list.component').then(m => m.GenreListComponent)
  },
  {
    path: 'create',
    loadComponent: () => import('./genre-form/genre-form.component').then(m => m.GenreFormComponent)
  },
  {
    path: 'edit/:id',
    loadComponent: () => import('./genre-form/genre-form.component').then(m => m.GenreFormComponent)
  }
];

// NOTE: Copia los archivos de artists y reemplaza "Artist" por "Genre"
