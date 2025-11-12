import { Routes } from '@angular/router';

export const PLAYLISTS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./playlist-list/playlist-list.component').then(m => m.PlaylistListComponent)
  },
  {
    path: 'create',
    loadComponent: () => import('./playlist-form/playlist-form.component').then(m => m.PlaylistFormComponent)
  },
  {
    path: 'edit/:id',
    loadComponent: () => import('./playlist-form/playlist-form.component').then(m => m.PlaylistFormComponent)
  },
  {
    path: ':id/songs',
    loadComponent: () => import('./playlist-songs/playlist-songs.component').then(m => m.PlaylistSongsComponent)
  }
];
