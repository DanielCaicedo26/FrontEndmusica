// Importaciones necesarias para el componente
import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { SongService, AlbumService, GenreService } from '@core/services';
import { Album, Genre } from '@core/models';

/**
 * Componente para el formulario de canciones
 * Permite crear nuevos canciones y editar canciones existentes
 * Utiliza signals para el manejo de estado reactivo
 */
@Component({
  selector: 'app-song-form',
  standalone: true, // Componente standalone de Angular
  imports: [CommonModule, ReactiveFormsModule, RouterLink], // Módulos necesarios
  templateUrl: './song-form.component.html',
  styleUrls: ['./song-form.component.scss']
})
export class SongFormComponent implements OnInit {
  // Inyección de dependencias usando la función inject()
  private fb = inject(FormBuilder); // Constructor de formularios reactivos
  private songService = inject(SongService); // Servicio para operaciones CRUD de canciones
  private albumService = inject(AlbumService); // Servicio para obtener álbumes
  private genreService = inject(GenreService); // Servicio para obtener géneros
  private router = inject(Router); // Servicio para navegación
  private route = inject(ActivatedRoute); // Información de la ruta actual

  // Formulario reactivo para la canción
  songForm: FormGroup;
  
  // Signals para manejo de estado reactivo
  isLoading = signal(false); // Indica si hay una operación en curso
  isEditMode = signal(false); // Determina si estamos editando o creando
  albums = signal<Album[]>([]); // Lista de álbumes disponibles
  genres = signal<Genre[]>([]); // Lista de géneros disponibles
  
  // ID de la canción en caso de modo edición
  songId: number | null = null;

  /**
   * Constructor del componente
   * Inicializa el formulario con sus campos y validaciones
   */
  constructor() {
    // Creación del formulario con sus campos y validaciones
    this.songForm = this.fb.group({
      name: ['', Validators.required], // Nombre de la canción (obligatorio)
      description: ['', Validators.required], // Descripción de la canción (obligatorio)
      durationSeconds: [0, [Validators.required, Validators.min(1)]], // Duración en segundos (obligatorio)
      audioUrl: ['', Validators.required], // URL del audio (obligatorio)
      albumId: [null, Validators.required], // ID del álbum (obligatorio)
      genreId: [null, Validators.required] // ID del género (obligatorio)
    });
  }

  /**
   * Hook del ciclo de vida de Angular
   * Se ejecuta cuando el componente se inicializa
   * Detecta si estamos en modo edición y carga los datos de la canción
   */
  ngOnInit(): void {
    // Cargar listas de álbumes y géneros
    this.loadAlbums();
    this.loadGenres();

    // Obtener el ID de la canción desde los parámetros de la ruta
    const id = this.route.snapshot.paramMap.get('id');
    
    // Si existe un ID, estamos en modo edición
    if (id) {
      this.isEditMode.set(true); // Activar modo edición
      this.songId = +id; // Convertir string a número
      this.loadSong(this.songId); // Cargar datos de la canción
    }
  }

  /**
   * Carga la lista de álbumes disponibles
   */
  loadAlbums(): void {
    this.albumService.getAll().subscribe({
      next: (albums) => this.albums.set(albums),
      error: (error) => console.error('Error loading albums:', error)
    });
  }

  /**
   * Carga la lista de géneros disponibles
   */
  loadGenres(): void {
    this.genreService.getAll().subscribe({
      next: (genres) => this.genres.set(genres),
      error: (error) => console.error('Error loading genres:', error)
    });
  }

  /**
   * Carga los datos de una canción existente desde el servidor
   * @param id - ID de la canción a cargar
   */
  loadSong(id: number): void {
    this.songService.getById(id).subscribe({
      // Éxito: rellenar el formulario con los datos de la canción
      next: (song) => this.songForm.patchValue(song),
      // Error: mostrar mensaje y redirigir a la lista
      error: (error) => {
        alert('Error loading song: ' + error.message);
        this.router.navigate(['/songs']);
      }
    });
  }

  /**
   * Maneja el envío del formulario
   * Valida los datos y ejecuta la operación de crear o actualizar
   */
  onSubmit(): void {
    // Verificar si el formulario es inválido
    if (this.songForm.invalid) {
      // Marcar todos los campos como tocados para mostrar errores
      this.songForm.markAllAsTouched();
      return; // Detener la ejecución
    }

    // Activar indicador de carga
    this.isLoading.set(true);
    
    // Determinar si vamos a actualizar o crear según el modo
    const operation = this.isEditMode()
      ? this.songService.update(this.songId!, this.songForm.value) // Actualizar canción existente
      : this.songService.create(this.songForm.value); // Crear nueva canción

    // Ejecutar la operación seleccionada  
    operation.subscribe({
      // Éxito: navegar a la lista de canciones
      next: () => this.router.navigate(['/songs']),
      // Error: mostrar mensaje y desactivar indicador de carga
      error: (error) => {
        alert('Error: ' + error.message);
        this.isLoading.set(false);
      }
    });
  }
}
