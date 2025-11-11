import { Routes } from '@angular/router';
import { authGuard } from '@core/guards/auth.guard';
import { publicGuard } from '@core/guards/public.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  {
    path: 'auth',
    canActivate: [publicGuard],
    loadChildren: () => import('./features/auth/auth.routes').then(m => m.AUTH_ROUTES)
  },
  {
    path: 'dashboard',
    canActivate: [authGuard],
    loadComponent: () => import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent)
  },
  {
    path: 'artists',
    canActivate: [authGuard],
    loadChildren: () => import('./features/artists/artists.routes').then(m => m.ARTISTS_ROUTES)
  },
  {
    path: 'albums',
    canActivate: [authGuard],
    loadChildren: () => import('./features/albums/albums.routes').then(m => m.ALBUMS_ROUTES)
  },
  {
    path: 'songs',
    canActivate: [authGuard],
    loadChildren: () => import('./features/songs/songs.routes').then(m => m.SONGS_ROUTES)
  },
  {
    path: 'genres',
    canActivate: [authGuard],
    loadChildren: () => import('./features/genres/genres.routes').then(m => m.GENRES_ROUTES)
  },
  {
    path: 'playlists',
    canActivate: [authGuard],
    loadChildren: () => import('./features/playlists/playlists.routes').then(m => m.PLAYLISTS_ROUTES)
  },
  { path: '**', redirectTo: 'dashboard' }
];
