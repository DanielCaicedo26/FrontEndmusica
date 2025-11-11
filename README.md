# Music Security Frontend

Sistema de gestión musical con autenticación JWT y autorización basada en roles.

## Tecnologías

- **Angular 17** (Standalone Components)
- **TypeScript** (Strict mode)
- **RxJS** para programación reactiva
- **Signals** para state management
- **SCSS** para estilos
- **Reactive Forms** para formularios

## Instalación

```bash
npm install
```

## Desarrollo

```bash
npm start
```

La aplicación estará disponible en `http://localhost:4200/`

## Build de Producción

```bash
npm run build
```

## Estructura del Proyecto

```
src/
├── app/
│   ├── core/                # Servicios singleton, guards, interceptors
│   ├── features/            # Módulos de funcionalidades
│   ├── shared/              # Componentes compartidos
│   └── app.routes.ts        # Configuración de rutas
├── environments/            # Configuración por entorno
└── styles.scss             # Estilos globales
```

## Configuración API

Edita `src/environments/environment.ts` para cambiar la URL de la API del backend.

## Características

- ✅ Autenticación JWT con refresh tokens
- ✅ Guards de rutas para protección
- ✅ Interceptors HTTP para tokens y errores
- ✅ Lazy loading de módulos
- ✅ Arquitectura modular escalable
- ✅ Type-safe con TypeScript
- ✅ Responsive design
