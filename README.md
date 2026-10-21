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

## Catálogo de música

La búsqueda principal utiliza la API pública de Audius para explorar pistas de artistas independientes. La reproducción usa el endpoint de stream de Audius dentro del reproductor HTML5 de Ritmavia; no se descargan ni se alojan archivos de audio en el proyecto.

Que la API esté disponible sin coste no garantiza derechos comerciales sobre cada pista ni autoriza por sí solo la monetización de Ritmavia. Antes de un lanzamiento público o monetizado, revisá las condiciones actuales de Audius, los términos aplicables y los derechos/licencias de las pistas. El catálogo de música comercial queda pendiente de una integración con derechos expresos para ese uso.
