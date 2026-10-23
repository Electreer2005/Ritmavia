# Ritmavia

**Tu música, a tu ritmo.**  
Ritmavia es una experiencia musical web hecha con React y Vite para explorar audio independiente, encontrar videos musicales y guardar una colección personal.

> Proyecto en desarrollo. La disponibilidad de canciones y videos depende de cada plataforma, región, configuración y términos de uso.

## Qué incluye

- **Explorar música:** accesos rápidos a estilos y búsquedas sugeridas.
- **Búsqueda combinada:** catálogo de audio independiente de Audius y videos musicales de YouTube.
- **Reproductor persistente:** controles de reproducción, progreso, volumen, reproducción aleatoria, repetición y cola.
- **Favoritos por cuenta:** los temas guardados se asocian a la cuenta y se conservan en el navegador utilizado.
- **Autenticación:** registro, inicio de sesión, cierre de sesión y recuperación de contraseña mediante Supabase.
- **Diseño adaptable:** interfaz para escritorio y dispositivos móviles, con navegación móvil.
- **PWA:** manifiesto e icono para permitir la instalación en navegadores compatibles.

## Tecnologías

- React + Vite
- React Router
- Zustand
- Supabase Auth
- Audius API
- YouTube Data API v3
- CSS Modules y Lucide

## Ejecutar localmente

Requisitos: Node.js compatible con la versión de Vite instalada y npm.

```bash
git clone https://github.com/Electreer2005/Ritmavia.git
cd Ritmavia
npm install
```

Creá un archivo `.env.local` en la raíz. Agregá las variables que vayas a usar:

```env
VITE_SUPABASE_URL=https://TU-PROYECTO.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=TU_CLAVE_PUBLICA
VITE_YOUTUBE_API_KEY=TU_CLAVE_DE_YOUTUBE
```

También se acepta `VITE_SUPABASE_ANON_KEY` en lugar de `VITE_SUPABASE_PUBLISHABLE_KEY` si tu proyecto todavía utiliza ese nombre.

Después ejecutá:

```bash
npm run dev
```

Para revisar el proyecto antes de publicarlo:

```bash
npm run lint
npm run build
node --test tests/auth.test.js
```

## Configuración de servicios

### Supabase Auth

1. Creá un proyecto en Supabase.
2. Copiá la URL del proyecto y la clave pública/publishable a `.env.local`.
3. En la configuración de Auth, revisá las URL permitidas para desarrollo y producción.
4. Configurá las URL de redirección para confirmación de correo y recuperación de contraseña.
5. No agregues claves `service_role` al frontend ni las publiques en el repositorio.

### YouTube Data API

1. Habilitá YouTube Data API v3 en Google Cloud.
2. Creá una API key y restringila a los sitios donde se utilizará.
3. Configurá `VITE_YOUTUBE_API_KEY` en `.env.local`.
4. Reiniciá el servidor de Vite después de cambiar variables.

Sin una clave de YouTube, la búsqueda de Audius puede seguir funcionando, pero no se mostrarán resultados de YouTube.

## Consideraciones importantes

- Audius está orientado a audio independiente. La disponibilidad y los derechos de cada pista dependen de sus condiciones.
- Los videos se reproducen mediante el reproductor oficial de YouTube. No se garantiza reproducción en segundo plano.
- Una API gratuita no implica automáticamente derechos para redistribuir música o monetizar el servicio. Antes de un lanzamiento comercial, revisá los términos de las plataformas y las licencias aplicables.
- Los favoritos se guardan en el almacenamiento local del navegador por cuenta. En esta versión no se sincronizan automáticamente entre dispositivos.
- Nunca subas `.env.local` ni claves privadas a GitHub.

## Estado del proyecto

Ritmavia está en etapa de desarrollo y prueba. Antes de anunciar una versión pública, ejecutá las comprobaciones de arriba y probá los flujos principales en escritorio y móvil.

## Enlaces

- Repositorio: https://github.com/Electreer2005/Ritmavia
- Audius: https://audius.co
- YouTube: https://www.youtube.com
- Supabase: https://supabase.com
