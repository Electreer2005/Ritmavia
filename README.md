# Ritmavia

Aplicación React + Vite con Supabase Auth.

Leé CONFIGURAR-SUPABASE.md para conectar tu proyecto, configurar confirmación y recuperación y probar los flujos.

Inicio, Buscar y Álbum son públicos. Biblioteca, Favoritos y Perfil requieren sesión.
Nombre y descripción se guardan en Supabase Auth. Favoritos se guardan en este navegador por cuenta.

Instalación: npm install
Desarrollo: npm run dev
Compilar: npm run build
Revisar código: npm run lint
Pruebas: node --test tests/auth.test.js

## Catálogo musical combinado

- Audius: búsqueda y streaming de audio independiente dentro del reproductor HTML5.
- YouTube: búsqueda de videos musicales mediante YouTube Data API y reproducción con el reproductor oficial integrado.

Para activar resultados de YouTube, configurá `VITE_YOUTUBE_API_KEY` en `.env.local`, habilitá YouTube Data API v3 en Google Cloud y restringí la clave al dominio de desarrollo/producción. No publiques una clave sin restricciones.

Los videos de YouTube no ofrecen reproducción garantizada en segundo plano y el reproductor puede detenerse al ocultarse la página. No deben tratarse como archivos de audio ni extraerse para reproducirlos fuera del reproductor oficial. Para uso comercial de ambos catálogos, verificá los términos actuales de cada plataforma y las licencias de cada pista antes del lanzamiento.
