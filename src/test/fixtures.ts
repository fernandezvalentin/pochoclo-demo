import type { Movie } from '../types/movie';

export const makeMovie = (id: number, extra: Partial<Movie> = {}): Movie => ({
  id,
  title: `Película ${id}`,
  poster_path: `/poster-${id}.jpg`,
  backdrop_path: `/backdrop-${id}.jpg`,
  overview: `Descripción de la película ${id}.`,
  release_date: '2024-05-10',
  vote_average: 7.8,
  genre_ids: [28],
  media_type: 'movie',
  ...extra,
});
