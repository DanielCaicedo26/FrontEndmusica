import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { PersonService } from '@core/services/person.service';
import { Person } from '@core/models';

@Component({
  selector: 'app-person-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './person-list.component.html',
  styleUrls: ['./person-list.component.scss']
})
export class PersonListComponent implements OnInit {
  private personService = inject(PersonService);

  persons = signal<Person[]>([]);
  isLoading = signal(false);
  errorMessage = signal('');
  successMessage = signal('');
  selectedPerson = signal<Person | null>(null);
  showDeleteModal = signal(false);

  ngOnInit() {
    this.loadPersons();
  }

  loadPersons() {
    this.isLoading.set(true);
    this.errorMessage.set('');

    this.personService.getAll().subscribe({
      next: (persons) => {
        this.persons.set(persons);
        this.isLoading.set(false);
      },
      error: (error) => {
        console.error('Error loading persons:', error);
        this.errorMessage.set('Error al cargar personas');
        this.isLoading.set(false);
      }
    });
  }

  openDeleteModal(person: Person) {
    this.selectedPerson.set(person);
    this.showDeleteModal.set(true);
  }

  closeDeleteModal() {
    this.showDeleteModal.set(false);
    this.selectedPerson.set(null);
  }

  confirmDelete() {
    const person = this.selectedPerson();
    if (!person) return;

    this.personService.delete(person.id).subscribe({
      next: () => {
        this.successMessage.set('Persona eliminada exitosamente');
        this.loadPersons();
        this.closeDeleteModal();
        setTimeout(() => this.successMessage.set(''), 3000);
      },
      error: (error) => {
        console.error('Error deleting person:', error);
        this.errorMessage.set('Error al eliminar persona');
        this.closeDeleteModal();
        setTimeout(() => this.errorMessage.set(''), 3000);
      }
    });
  }

  getFullName(person: Person): string {
    return `${person.firstName} ${person.lastName}`;
  }
}
