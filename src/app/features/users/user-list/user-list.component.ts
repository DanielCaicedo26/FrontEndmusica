import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { UserService } from '@core/services/user.service';
import { AppUser } from '@core/models';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent implements OnInit {
  private userService = inject(UserService);

  users = signal<AppUser[]>([]);
  isLoading = signal(false);
  errorMessage = signal('');
  successMessage = signal('');
  selectedUser = signal<AppUser | null>(null);
  showDeleteModal = signal(false);

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    this.isLoading.set(true);
    this.errorMessage.set('');

    this.userService.getAll().subscribe({
      next: (users) => {
        this.users.set(users);
        this.isLoading.set(false);
      },
      error: (error) => {
        console.error('Error loading users:', error);
        this.errorMessage.set('Error al cargar usuarios');
        this.isLoading.set(false);
      }
    });
  }

  toggleUserStatus(user: AppUser) {
    this.userService.toggleUserStatus(user.id).subscribe({
      next: () => {
        this.successMessage.set(`Usuario ${user.isActive ? 'desactivado' : 'activado'} exitosamente`);
        this.loadUsers();
        setTimeout(() => this.successMessage.set(''), 3000);
      },
      error: (error) => {
        console.error('Error toggling user status:', error);
        this.errorMessage.set('Error al cambiar estado del usuario');
        setTimeout(() => this.errorMessage.set(''), 3000);
      }
    });
  }

  openDeleteModal(user: AppUser) {
    this.selectedUser.set(user);
    this.showDeleteModal.set(true);
  }

  closeDeleteModal() {
    this.showDeleteModal.set(false);
    this.selectedUser.set(null);
  }

  confirmDelete() {
    const user = this.selectedUser();
    if (!user) return;

    this.userService.delete(user.id).subscribe({
      next: () => {
        this.successMessage.set('Usuario eliminado exitosamente');
        this.loadUsers();
        this.closeDeleteModal();
        setTimeout(() => this.successMessage.set(''), 3000);
      },
      error: (error) => {
        console.error('Error deleting user:', error);
        this.errorMessage.set('Error al eliminar usuario');
        this.closeDeleteModal();
        setTimeout(() => this.errorMessage.set(''), 3000);
      }
    });
  }

  getRolesBadges(roles: string[] | undefined): string[] {
    return roles || ['User'];
  }
}
