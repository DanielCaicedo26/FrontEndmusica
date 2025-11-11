// Importaciones necesarias para el componente
import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { ArtistService } from '@core/services';

/**
 * Componente para el formulario de artistas
 * Permite crear nuevos artistas y editar artistas existentes
 * Utiliza signals para el manejo de estado reactivo
 */
@Component({
  selector: 'app-artist-form',
  standalone: true, // Componente standalone de Angular
  imports: [CommonModule, ReactiveFormsModule, RouterLink], // Módulos necesarios
  templateUrl: './artist-form.component.html',
  styleUrls: ['./artist-form.component.scss']
})
export class ArtistFormComponent implements OnInit {
  // Inyección de dependencias usando la función inject()
  private fb = inject(FormBuilder); // Constructor de formularios reactivos
  private artistService = inject(ArtistService); // Servicio para operaciones CRUD de artistas
  private router = inject(Router); // Servicio para navegación
  private route = inject(ActivatedRoute); // Información de la ruta actual

  // Formulario reactivo para el artista
  artistForm: FormGroup;
  
  // Signals para manejo de estado reactivo
  isLoading = signal(false); // Indica si hay una operación en curso
  isEditMode = signal(false); // Determina si estamos editando o creando
  
  // ID del artista en caso de modo edición
  artistId: number | null = null;

  /**
   * Constructor del componente
   * Inicializa el formulario con sus campos y validaciones
   */
  constructor() {
    // Creación del formulario con sus campos y validaciones
    this.artistForm = this.fb.group({
      name: ['', Validators.required], // Nombre del artista (obligatorio)
      description: ['', Validators.required], // Descripción del artista (obligatorio)
      country: ['', Validators.required], // País del artista (obligatorio)
      debutDate: [''] // Fecha de debut (opcional)
    });
  }

  /**
   * Hook del ciclo de vida de Angular
   * Se ejecuta cuando el componente se inicializa
   * Detecta si estamos en modo edición y carga los datos del artista
   */
  ngOnInit(): void {
    // Obtener el ID del artista desde los parámetros de la ruta
    const id = this.route.snapshot.paramMap.get('id');
    
    // Si existe un ID, estamos en modo edición
    if (id) {
      this.isEditMode.set(true); // Activar modo edición
      this.artistId = +id; // Convertir string a número
      this.loadArtist(this.artistId); // Cargar datos del artista
    }
  }

  /**
   * Carga los datos de un artista existente desde el servidor
   * @param id - ID del artista a cargar
   */
  loadArtist(id: number): void {
    this.artistService.getById(id).subscribe({
      // Éxito: rellenar el formulario con los datos del artista
      next: (artist) => this.artistForm.patchValue(artist),
      // Error: mostrar mensaje y redirigir a la lista
      error: (error) => {
        alert('Error loading artist: ' + error.message);
        this.router.navigate(['/artists']);
      }
    });
  }

  /**
   * Maneja el envío del formulario
   * Valida los datos y ejecuta la operación de crear o actualizar
   */
  onSubmit(): void {
    // Verificar si el formulario es inválido
    if (this.artistForm.invalid) {
      // Marcar todos los campos como tocados para mostrar errores
      this.artistForm.markAllAsTouched();
      return; // Detener la ejecución
    }

    // Activar indicador de carga
    this.isLoading.set(true);
    
    // Determinar si vamos a actualizar o crear según el modo
    const operation = this.isEditMode()
      ? this.artistService.update(this.artistId!, this.artistForm.value) // Actualizar artista existente
      : this.artistService.create(this.artistForm.value); // Crear nuevo artista

    // Ejecutar la operación seleccionada  
    operation.subscribe({
      // Éxito: navegar a la lista de artistas
      next: () => this.router.navigate(['/artists']),
      // Error: mostrar mensaje y desactivar indicador de carga
      error: (error) => {
        alert('Error: ' + error.message);
        this.isLoading.set(false);
      }
    });
  }
}
