import { Routes } from '@angular/router';

export const ARTISTS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./artist-list/artist-list.component').then(m => m.ArtistListComponent)
  },
  {
    path: 'create',
    loadComponent: () => import('./artist-form/artist-form.component').then(m => m.ArtistFormComponent)
  },
  {
    path: 'edit/:id',
    loadComponent: () => import('./artist-form/artist-form.component').then(m => m.ArtistFormComponent)
  }
];
