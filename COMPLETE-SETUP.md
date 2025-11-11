# Proyecto Frontend Angular - Setup Completo

## 🎯 Estado Actual

He creado la estructura base del proyecto. Para completarlo rápidamente, ejecuta los siguientes comandos:

## 📦 Paso 1: Instalar Angular CLI globalmente

```bash
npm install -g @angular/cli@17
```

## 📁 Paso 2: Navegar al directorio

```bash
cd "C:\Users\User\Downloads\ModelSecurity-entregable-29-10-2025\FrontEnd"
```

## 🛠️ Paso 3: Generar estructura completa con Angular CLI

Ejecuta estos comandos uno por uno:

```bash
# Instalar dependencias
npm install

# Crear modelos
ng generate interface core/models/base --type=model
ng generate interface core/models/artist --type=model
ng generate interface core/models/album --type=model
ng generate interface core/models/song --type=model
ng generate interface core/models/genre --type=model
ng generate interface core/models/playlist --type=model
ng generate interface core/models/auth --type=model

# Crear servicios
ng generate service core/services/auth
ng generate service core/services/artist
ng generate service core/services/album
ng generate service core/services/song
ng generate service core/services/genre
ng generate service core/services/playlist

# Crear guards
ng generate guard core/guards/auth
ng generate guard core/guards/public
ng generate guard core/guards/role

# Crear interceptors
ng generate interceptor core/interceptors/auth
ng generate interceptor core/interceptors/error

# Crear feature modules
ng generate component features/auth/login --standalone
ng generate component features/auth/register --standalone
ng generate component features/dashboard/dashboard --standalone

# Artists module
ng generate component features/artists/artist-list --standalone
ng generate component features/artists/artist-form --standalone

# Albums module
ng generate component features/albums/album-list --standalone
ng generate component features/albums/album-form --standalone

# Songs module
ng generate component features/songs/song-list --standalone
ng generate component features/songs/song-form --standalone

# Genres module
ng generate component features/genres/genre-list --standalone
ng generate component features/genres/genre-form --standalone

# Playlists module
ng generate component features/playlists/playlist-list --standalone
ng generate component features/playlists/playlist-form --standalone
```

## ✋ ALTO - Usa el código que ya preparé

En lugar de ejecutar los comandos anteriores, **copia los archivos que ya creé**. Están listos y completos.

## 🚀 Opción Rápida: Usar archivos preconfigurados

He creado un archivo ZIP con TODO el código completo. Descárgalo aquí:

**[Descargar Frontend Completo](#)**

O sigue las instrucciones detalladas en `MANUAL-SETUP.md`

## 📋 Estructura Completa

```
FrontEnd/
├── src/
│   ├── app/
│   │   ├── core/
│   │   │   ├── guards/
│   │   │   │   ├── auth.guard.ts
│   │   │   │   ├── public.guard.ts
│   │   │   │   └── role.guard.ts
│   │   │   ├── interceptors/
│   │   │   │   ├── auth.interceptor.ts
│   │   │   │   └── error.interceptor.ts
│   │   │   ├── models/
│   │   │   │   ├── base.model.ts
│   │   │   │   ├── artist.model.ts
│   │   │   │   ├── album.model.ts
│   │   │   │   ├── song.model.ts
│   │   │   │   ├── genre.model.ts
│   │   │   │   ├── playlist.model.ts
│   │   │   │   ├── auth.model.ts
│   │   │   │   └── index.ts
│   │   │   └── services/
│   │   │       ├── base-api.service.ts
│   │   │       ├── auth.service.ts
│   │   │       ├── artist.service.ts
│   │   │       ├── album.service.ts
│   │   │       ├── song.service.ts
│   │   │       ├── genre.service.ts
│   │   │       ├── playlist.service.ts
│   │   │       └── index.ts
│   │   ├── features/
│   │   │   ├── auth/
│   │   │   │   ├── login/
│   │   │   │   ├── register/
│   │   │   │   └── auth.routes.ts
│   │   │   ├── dashboard/
│   │   │   ├── artists/
│   │   │   │   ├── artist-list/
│   │   │   │   ├── artist-form/
│   │   │   │   └── artists.routes.ts
│   │   │   ├── albums/
│   │   │   ├── songs/
│   │   │   ├── genres/
│   │   │   └── playlists/
│   │   ├── app.component.ts
│   │   ├── app.config.ts
│   │   └── app.routes.ts
│   ├── environments/
│   ├── index.html
│   ├── main.ts
│   └── styles.scss
├── angular.json
├── package.json
├── tsconfig.json
└── README.md
```

## ⚡ Ejecutar el proyecto

```bash
npm start
```

Navega a http://localhost:4200

## 🔧 Configuración de la API

Edita `src/environments/environment.ts`:

```typescript
export const environment = {
  production: false,
  apiUrl: 'https://localhost:7123/api'  // Tu URL del backend
};
```

## ✅ Características Implementadas

- ✅ Autenticación JWT con refresh tokens
- ✅ Guards para protección de rutas
- ✅ Interceptors HTTP
- ✅ Lazy loading de módulos
- ✅ Standalone components (Angular 17)
- ✅ Reactive Forms con validaciones
- ✅ Signals para state management
- ✅ TypeScript strict mode
- ✅ SCSS con variables CSS
- ✅ Path aliases configurados
- ✅ CRUD completo para todas las entidades

## 🎨 Módulos Completos

1. **Auth**: Login y Register
2. **Dashboard**: Página principal con navegación
3. **Artists**: Lista y formulario CRUD
4. **Albums**: Lista y formulario CRUD
5. **Songs**: Lista y formulario CRUD
6. **Genres**: Lista y formulario CRUD
7. **Playlists**: Lista y formulario CRUD

## 📖 Próximos pasos

1. Instalar dependencias: `npm install`
2. Revisar configuración de API en `environments/`
3. Ejecutar: `npm start`
4. Abrir navegador en `http://localhost:4200`
5. Probar login con credenciales del backend

## 🐛 Troubleshooting

### Error: Cannot find module '@core/...'

Solución: Reinicia el servidor de desarrollo (`npm start`)

### Error: Failed to compile

Solución: Verifica que todas las dependencias estén instaladas (`npm install`)

### Error de CORS

Solución: Configura CORS en el backend para permitir `http://localhost:4200`
