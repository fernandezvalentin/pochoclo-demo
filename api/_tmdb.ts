// Lógica compartida del proxy de TMDB (la usan la función de Vercel y el servidor de Vite).
// Los archivos que empiezan con "_" dentro de /api no se publican como endpoints.

export const TMDB_ORIGIN = 'https://api.themoviedb.org';
const TMDB_VERSION = '/3';

// Solo dejamos pasar las rutas de solo lectura que usa la app.
const ALLOWED_PATH = /^\/(trending|discover|movie|tv|search)(\/[\w-]+)*$/;

/**
 * Arma la URL final de TMDB agregando la API key del lado del servidor.
 * Devuelve null si la ruta no está permitida.
 */
export function buildTmdbUrl(path: string, params: URLSearchParams, apiKey: string): URL | null {
  if (!ALLOWED_PATH.test(path)) return null;

  const url = new URL(`${TMDB_ORIGIN}${TMDB_VERSION}${path}`);
  params.forEach((value, key) => {
    // "path" lo agrega el rewrite de Vercel; "api_key" nunca se acepta desde el cliente.
    if (key !== 'path' && key !== 'api_key') url.searchParams.set(key, value);
  });
  if (!url.searchParams.has('language')) url.searchParams.set('language', 'es-ES');
  url.searchParams.set('api_key', apiKey);
  return url;
}
