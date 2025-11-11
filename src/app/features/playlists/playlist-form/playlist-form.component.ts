// Importaciones necesarias para el componente
import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { PlaylistService } from '@core/services';

/**
 * Componente para el formulario de playlists
 * Permite crear nuevas playlists y editar playlists existentes
 * Utiliza signals para el manejo de estado reactivo
 */
@Component({
  selector: 'app-playlist-form',
  standalone: true, // Componente standalone de Angular
  imports: [CommonModule, ReactiveFormsModule, RouterLink], // Módulos necesarios
  templateUrl: './playlist-form.component.html',
  styleUrls: ['./playlist-form.component.scss']
})
export class PlaylistFormComponent implements OnInit {
  // Inyección de dependencias usando la función inject()
  private fb = inject(FormBuilder); // Constructor de formularios reactivos
  private playlistService = inject(PlaylistService); // Servicio para operaciones CRUD de playlists
  private router = inject(Router); // Servicio para navegación
  private route = inject(ActivatedRoute); // Información de la ruta actual

  // Formulario reactivo para la playlist
  playlistForm: FormGroup;
  
  // Signals para manejo de estado reactivo
  isLoading = signal(false); // Indica si hay una operación en curso
  isEditMode = signal(false); // Determina si estamos editando o creando
  
  // ID de la playlist en caso de modo edición
  playlistId: number | null = null;

  /**
   * Constructor del componente
   * Inicializa el formulario con sus campos y validaciones
   */
  constructor() {
    // Creación del formulario con sus campos y validaciones
    this.playlistForm = this.fb.group({
      name: ['', Validators.required], // Nombre de la playlist (obligatorio)
      description: ['', Validators.required], // Descripción de la playlist (obligatorio)
      userId: [1, Validators.required], // ID del usuario (obligatorio) - Por defecto 1
      isPublic: [false] // Si la playlist es pública (por defecto privada)
    });
  }

  /**
   * Hook del ciclo de vida de Angular
   * Se ejecuta cuando el componente se inicializa
   * Detecta si estamos en modo edición y carga los datos de la playlist
   */
  ngOnInit(): void {
    // Obtener el ID de la playlist desde los parámetros de la ruta
    const id = this.route.snapshot.paramMap.get('id');
    
    // Si existe un ID, estamos en modo edición
    if (id) {
      this.isEditMode.set(true); // Activar modo edición
      this.playlistId = +id; // Convertir string a número
      this.loadPlaylist(this.playlistId); // Cargar datos de la playlist
    }
  }

  /**
   * Carga los datos de una playlist existente desde el servidor
   * @param id - ID de la playlist a cargar
   */
  loadPlaylist(id: number): void {
    this.playlistService.getById(id).subscribe({
      // Éxito: rellenar el formulario con los datos de la playlist
      next: (playlist) => this.playlistForm.patchValue(playlist),
      // Error: mostrar mensaje y redirigir a la lista
      error: (error) => {
        alert('Error loading playlist: ' + error.message);
        this.router.navigate(['/playlists']);
      }
    });
  }

  /**
   * Maneja el envío del formulario
   * Valida los datos y ejecuta la operación de crear o actualizar
   */
  onSubmit(): void {
    // Verificar si el formulario es inválido
    if (this.playlistForm.invalid) {
      // Marcar todos los campos como tocados para mostrar errores
      this.playlistForm.markAllAsTouched();
      return; // Detener la ejecución
    }

    // Activar indicador de carga
    this.isLoading.set(true);
    
    // Determinar si vamos a actualizar o crear según el modo
    const operation = this.isEditMode()
      ? this.playlistService.update(this.playlistId!, this.playlistForm.value) // Actualizar playlist existente
      : this.playlistService.create(this.playlistForm.value); // Crear nueva playlist

    // Ejecutar la operación seleccionada  
    operation.subscribe({
      // Éxito: navegar a la lista de playlists
      next: () => this.router.navigate(['/playlists']),
      // Error: mostrar mensaje y desactivar indicador de carga
      error: (error) => {
        alert('Error: ' + error.message);
        this.isLoading.set(false);
      }
    });
  }
}
