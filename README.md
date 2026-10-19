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

## YouTube
Leé CONFIGURAR-YOUTUBE.md para crear y restringir la clave de YouTube Data API v3.
La búsqueda trae videos musicales; la reproducción usa el IFrame Player oficial en un panel visible. Los videos no se descargan ni se almacenan.
Los álbumes de Inicio siguen siendo demostrativos.
