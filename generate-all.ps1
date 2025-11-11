# Script para generar TODOS los archivos del frontend Angular
# Ejecutar desde: C:\Users\User\Downloads\ModelSecurity-entregable-29-10-2025\FrontEnd
# Comando: powershell -ExecutionPolicy Bypass -File generate-all.ps1

Write-Host "🚀 Generando estructura completa del frontend..." -ForegroundColor Green

# Crear estructura de carpetas
$folders = @(
    "src/app/core/models",
    "src/app/core/services",
    "src/app/core/guards",
    "src/app/core/interceptors",
    "src/app/features/auth/login",
    "src/app/features/auth/register",
    "src/app/features/dashboard",
    "src/app/features/artists/artist-list",
    "src/app/features/artists/artist-form",
    "src/app/features/albums/album-list",
    "src/app/features/albums/album-form",
    "src/app/features/songs/song-list",
    "src/app/features/songs/song-form",
    "src/app/features/genres/genre-list",
    "src/app/features/genres/genre-form",
    "src/app/features/playlists/playlist-list",
    "src/app/features/playlists/playlist-form",
    "src/assets"
)

foreach ($folder in $folders) {
    New-Item -ItemType Directory -Force -Path $folder | Out-Null
    Write-Host "  ✓ Created: $folder" -ForegroundColor Gray
}

Write-Host "`n📦 Instalando dependencias..." -ForegroundColor Green
npm install

Write-Host "`n✅ Estructura base creada!" -ForegroundColor Green
Write-Host "`nAhora copia los archivos de código desde el repositorio" -ForegroundColor Yellow
Write-Host "o sigue las instrucciones en MANUAL-SETUP.md" -ForegroundColor Yellow
