# 🍿 Pochoclo

Interfaz de streaming inspirada en las grandes plataformas, hecha con **React 19**, **TypeScript** y **Vite**, con datos en tiempo real de la API de **TMDB**.

**🔗 Demo:** https://pochoclo-demo.vercel.app

![CI](https://github.com/fernandezvalentin/pochoclo-demo/actions/workflows/ci.yml/badge.svg)

> Proyecto de portfolio con fines educativos. No es un servicio real ni está afiliado a ninguna plataforma de streaming. No pide ni guarda datos personales.

## 📸 Capturas

| Selector de perfiles | Inicio |
| --- | --- |
| ![Selector de perfiles](docs/screenshots/perfiles.png) | ![Inicio](docs/screenshots/inicio.png) |

| Detalle de un título | Mobile |
| --- | --- |
| ![Detalle](docs/screenshots/detalle.png) | ![Mobile](docs/screenshots/mobile.png) |

## ✨ Funcionalidades

- **Perfiles:** pantalla "¿Quién está viendo ahora?" con avatares propios en SVG. El perfil elegido se recuerda al volver a entrar.
- **Perfil Niños:** el catálogo, la búsqueda y las notificaciones muestran solo contenido infantil y familiar.
- **Catálogo:** hero con un título destacado al azar, filas por género y una fila "Top 10 de hoy" con números grandes.
- **Búsqueda:** buscador en la barra de navegación que busca mientras escribís, con estados de carga, sin resultados y error.
- **Mi lista:** cada perfil guarda sus títulos favoritos desde el detalle de cada película o serie.
- **Novedades populares:** estrenos recientes, próximos estrenos y series en emisión.
- **Notificaciones:** campanita con contador de no leídas y acceso directo a cada título.
- **URLs reales:** cada sección tiene su ruta (`/series`, `/novedades`, `/mi-lista`, `/buscar?q=...`), el detalle de un título se puede compartir con un link (`?titulo=movie-603`) y el botón "atrás" del navegador funciona.
- **Responsive:** en mobile los links pasan a un menú "Explorar".
- **Accesibilidad:** navegación con teclado, `Esc` cierra modales y menús, y etiquetas ARIA en botones e íconos.

## 🛠️ Stack

| Área | Herramientas |
| --- | --- |
| UI | React 19, TypeScript, CSS sin librerías, Lucide (íconos) |
| Rutas | React Router 7 |
| Datos | API de TMDB a través de una función serverless propia (Vercel Functions), Axios |
| Tests | Vitest, React Testing Library, jsdom |
| Calidad | ESLint, GitHub Actions (lint + tests + build en cada push) |
| Deploy | Vercel |

## 🧠 Desafíos y decisiones técnicas

**Proteger la API key.** Cualquier variable `VITE_*` queda dentro del JavaScript que descarga el navegador. Por eso el front nunca llama a TMDB directamente: todas las requests pasan por `/api/tmdb`, una función serverless que agrega la key del lado del servidor. Además, solo acepta las rutas de lectura que usa la app, ignora cualquier `api_key` que mande el cliente y deja que la CDN de Vercel cachee las respuestas una hora. En desarrollo, el servidor de Vite hace de proxy con la misma lógica (`api/_tmdb.ts`), así que local y producción se comportan igual.

**Búsqueda que no satura la API.** El texto espera 400 ms sin cambios antes de buscar (debounce), y cada búsqueda cancela la anterior con `AbortController`, así que una respuesta vieja nunca pisa a una nueva. El texto del input vive en el componente y no solo en la URL: como React Router actualiza la URL en una transición, si el input dependiera de ella se perderían letras al escribir rápido. Lo detecté con un test de Playwright y quedó cubierto con un test unitario.

**El estado vive en la URL.** La sección, la búsqueda y el título abierto están en la URL. Eso permite compartir links, recargar sin perder el contexto y usar "atrás" para cerrar un modal. Si el título se abre desde un link compartido, se piden sus datos a la API; si se abre desde la app, se reutiliza el que ya estaba cargado.

**Cambiar de perfil sin estado viejo.** El contenido se monta con `key={profile.id}`: al cambiar de perfil, React vuelve a montar todo, y la búsqueda, Mi lista y las notificaciones arrancan limpias con los datos de ese perfil, sin sincronizaciones manuales.

**Marca propia.** La primera versión usaba el nombre y el logo de una plataforma real, y Google Safe Browsing marcó el sitio como posible phishing. Cambiar a una marca propia (Pochoclo) y sacar los textos copiados resolvió el problema. La lección: un clon con fines de portfolio tiene que verse como inspirado en el original, no como una copia.

## 📂 Estructura

```
api/                 Función serverless /api/tmdb y su lógica compartida
src/
  components/        Componentes de UI (Navbar, Hero, Row, MovieModal, SearchBox, Notifications, ...)
  hooks/             useMyList (lista por perfil) y useDebounce
  data/              Perfiles y géneros de TMDB
  services/api.ts    Cliente HTTP y helper de imágenes
  routes.ts          Rutas y helpers de URL
  test/              Configuración y datos de prueba
```

## ⚙️ Correr el proyecto

1. Cloná el repositorio e instalá las dependencias:

   ```bash
   git clone https://github.com/fernandezvalentin/pochoclo-demo.git
   cd pochoclo-demo
   npm install
   ```

2. Creá un archivo `.env` en la raíz (podés copiar `.env.example`) con tu API key de TMDB. Se consigue gratis en [themoviedb.org](https://www.themoviedb.org/settings/api).

   ```env
   TMDB_API_KEY=tu_api_key
   ```

3. Levantá el servidor de desarrollo:

   ```bash
   npm run dev
   ```

### Scripts

| Comando | Qué hace |
| --- | --- |
| `npm run dev` | Servidor de desarrollo con el proxy de TMDB |
| `npm test` | Corre los tests una vez |
| `npm run test:watch` | Corre los tests en modo watch |
| `npm run lint` | ESLint |
| `npm run build` | Chequeo de tipos y build de producción |

### Deploy en Vercel

Configurá la variable de entorno `TMDB_API_KEY` en *Settings → Environment Variables*. `vercel.json` se encarga de publicar la función `/api/tmdb` y de que las rutas de React Router funcionen al recargar.

## 🙌 Créditos

Datos e imágenes provistos por [TMDB](https://www.themoviedb.org/). Este producto usa la API de TMDB pero no está avalado ni certificado por TMDB.
