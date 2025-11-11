import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '@core/services';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {
  private authService = inject(AuthService);
  currentUser$ = this.authService.currentUser$;

  menuItems = [
    { title: 'Artists', route: '/artists', icon: '🎤' },
    { title: 'Albums', route: '/albums', icon: '💿' },
    { title: 'Songs', route: '/songs', icon: '🎵' },
    { title: 'Genres', route: '/genres', icon: '🎸' },
    { title: 'Playlists', route: '/playlists', icon: '📱' }
  ];

  get userFullName(): string {
    return this.authService.getUserFullName();
  }

  logout(): void {
    this.authService.logout();
  }
}
