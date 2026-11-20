import type { Movie } from './types/movie';

export type View = 'home' | 'series' | 'movies' | 'new' | 'mylist';

export const VIEW_PATHS: Record<View, string> = {
  home: '/',
  series: '/series',
  movies: '/peliculas',
  new: '/novedades',
  mylist: '/mi-lista',
};

export const SEARCH_PATH = '/buscar';

// Parámetro de la URL que abre el modal de un título, ej: /?titulo=movie-603
export const TITLE_PARAM = 'titulo';

export const viewFromPath = (pathname: string): View | null =>
  (Object.entries(VIEW_PATHS).find(([, path]) => path === pathname)?.[0] as View | undefined) ?? null;

export type MediaType = 'movie' | 'tv';

export const mediaTypeOf = (movie: Movie): MediaType =>
  movie.media_type === 'tv' || (!movie.title && !!movie.name) ? 'tv' : 'movie';

export const titleParamFor = (movie: Movie) => `${mediaTypeOf(movie)}-${movie.id}`;

export const parseTitleParam = (value: string | null): { type: MediaType; id: number } | null => {
  const match = value?.match(/^(movie|tv)-(\d+)$/);
  return match ? { type: match[1] as MediaType, id: Number(match[2]) } : null;
};
