// Importaciones necesarias para el componente
import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { GenreService } from '@core/services';

/**
 * Componente para el formulario de géneros
 * Permite crear nuevos géneros y editar géneros existentes
 * Utiliza signals para el manejo de estado reactivo
 */
@Component({
  selector: 'app-genre-form',
  standalone: true, // Componente standalone de Angular
  imports: [CommonModule, ReactiveFormsModule, RouterLink], // Módulos necesarios
  templateUrl: './genre-form.component.html',
  styleUrls: ['./genre-form.component.scss']
})
export class GenreFormComponent implements OnInit {
  // Inyección de dependencias usando la función inject()
  private fb = inject(FormBuilder); // Constructor de formularios reactivos
  private genreService = inject(GenreService); // Servicio para operaciones CRUD de géneros
  private router = inject(Router); // Servicio para navegación
  private route = inject(ActivatedRoute); // Información de la ruta actual

  // Formulario reactivo para el género
  genreForm: FormGroup;
  
  // Signals para manejo de estado reactivo
  isLoading = signal(false); // Indica si hay una operación en curso
  isEditMode = signal(false); // Determina si estamos editando o creando
  
  // ID del género en caso de modo edición
  genreId: number | null = null;

  /**
   * Constructor del componente
   * Inicializa el formulario con sus campos y validaciones
   */
  constructor() {
    // Creación del formulario con sus campos y validaciones
    this.genreForm = this.fb.group({
      name: ['', Validators.required], // Nombre del género (obligatorio)
      description: ['', Validators.required] // Descripción del género (obligatorio)
    });
  }

  /**
   * Hook del ciclo de vida de Angular
   * Se ejecuta cuando el componente se inicializa
   * Detecta si estamos en modo edición y carga los datos del género
   */
  ngOnInit(): void {
    // Obtener el ID del género desde los parámetros de la ruta
    const id = this.route.snapshot.paramMap.get('id');
    
    // Si existe un ID, estamos en modo edición
    if (id) {
      this.isEditMode.set(true); // Activar modo edición
      this.genreId = +id; // Convertir string a número
      this.loadGenre(this.genreId); // Cargar datos del género
    }
  }

  /**
   * Carga los datos de un género existente desde el servidor
   * @param id - ID del género a cargar
   */
  loadGenre(id: number): void {
    this.genreService.getById(id).subscribe({
      // Éxito: rellenar el formulario con los datos del género
      next: (genre) => this.genreForm.patchValue(genre),
      // Error: mostrar mensaje y redirigir a la lista
      error: (error) => {
        alert('Error loading genre: ' + error.message);
        this.router.navigate(['/genres']);
      }
    });
  }

  /**
   * Maneja el envío del formulario
   * Valida los datos y ejecuta la operación de crear o actualizar
   */
  onSubmit(): void {
    // Verificar si el formulario es inválido
    if (this.genreForm.invalid) {
      // Marcar todos los campos como tocados para mostrar errores
      this.genreForm.markAllAsTouched();
      return; // Detener la ejecución
    }

    // Activar indicador de carga
    this.isLoading.set(true);
    
    // Determinar si vamos a actualizar o crear según el modo
    const operation = this.isEditMode()
      ? this.genreService.update(this.genreId!, this.genreForm.value) // Actualizar género existente
      : this.genreService.create(this.genreForm.value); // Crear nuevo género

    // Ejecutar la operación seleccionada  
    operation.subscribe({
      // Éxito: navegar a la lista de géneros
      next: () => this.router.navigate(['/genres']),
      // Error: mostrar mensaje y desactivar indicador de carga
      error: (error) => {
        alert('Error: ' + error.message);
        this.isLoading.set(false);
      }
    });
  }
}
