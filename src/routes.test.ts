import { describe, expect, it } from 'vitest';
import { mediaTypeOf, parseTitleParam, titleParamFor, viewFromPath } from './routes';
import type { Movie } from './types/movie';

const movie = (extra: Partial<Movie>): Movie => ({
  id: 1, poster_path: '', backdrop_path: '', overview: '', vote_average: 0, genre_ids: [], ...extra,
});

describe('routes', () => {
  it('obtiene la sección a partir de la URL', () => {
    expect(viewFromPath('/')).toBe('home');
    expect(viewFromPath('/mi-lista')).toBe('mylist');
    expect(viewFromPath('/buscar')).toBeNull();
  });

  it('distingue películas de series', () => {
    expect(mediaTypeOf(movie({ title: 'Matrix' }))).toBe('movie');
    expect(mediaTypeOf(movie({ name: 'Dark' }))).toBe('tv');
    expect(mediaTypeOf(movie({ title: 'X', media_type: 'tv' }))).toBe('tv');
  });

  it('arma y lee el parámetro ?titulo=', () => {
    expect(titleParamFor(movie({ id: 603, title: 'Matrix' }))).toBe('movie-603');
    expect(parseTitleParam('tv-42')).toEqual({ type: 'tv', id: 42 });
    expect(parseTitleParam('person-1')).toBeNull();
    expect(parseTitleParam(null)).toBeNull();
  });
});
