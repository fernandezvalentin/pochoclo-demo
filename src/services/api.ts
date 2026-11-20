import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_TMDB_BASE_URL || 'https://api.themoviedb.org/3',
  params: {
    api_key: import.meta.env.VITE_TMDB_API_KEY,
    language: 'es-ES',
  },
});

export const requests = {
  fetchTrending: '/trending/all/week',
  fetchOriginals: '/discover/tv?with_networks=213',
  fetchTopRatedMovies: '/movie/top_rated',
  fetchTopRatedSeries: '/tv/top_rated',
  fetchActionMovies: '/discover/movie?with_genres=28',
  fetchComedyMovies: '/discover/movie?with_genres=35',
  fetchHorrorMovies: '/discover/movie?with_genres=27',
  fetchRomanceMovies: '/discover/movie?with_genres=10749',
  fetchDocumentaries: '/discover/movie?with_genres=99',
  fetchSeriesTrending: '/trending/tv/week',
  fetchMoviesTrending: '/trending/movie/week',
  fetchKidsMovies: '/discover/movie?with_genres=16&certification_country=US&certification.lte=G',
  fetchFamilyMovies: '/discover/movie?with_genres=10751',
  fetchKidsSeries: '/discover/tv?with_genres=10762',
  fetchAnimatedSeries: '/discover/tv?with_genres=16',
  // Novedades populares
  fetchTop10Today: '/trending/all/day',
  fetchNowPlaying: '/movie/now_playing',
  fetchUpcoming: '/movie/upcoming',
  fetchOnTheAir: '/tv/on_the_air',
  fetchNewKids: '/discover/movie?with_genres=16&sort_by=primary_release_date.desc&vote_count.gte=20',
};

// La variable de entorno apunta a .../t/p/original; nos quedamos con .../t/p
// para poder pedir tamaños más chicos (w300, w500) en las filas y cargar más rápido.
const IMAGE_ROOT = (import.meta.env.VITE_TMDB_IMAGE_BASE_URL || 'https://image.tmdb.org/t/p/original')
  .replace(/\/+$/, '')
  .replace(/\/[^/]+$/, '');

export type ImageSize = 'w300' | 'w500' | 'w780' | 'w1280' | 'original';

export const imageUrl = (path: string | null | undefined, size: ImageSize = 'original') =>
  path ? `${IMAGE_ROOT}/${size}${path}` : '';

export const searchTitles = async (query: string, signal?: AbortSignal) => {
  const { data } = await api.get('/search/multi', {
    params: { query, include_adult: false },
    signal,
  });
  return data.results ?? [];
};

export const getMovieDetails = async (id: number, mediaType: string = 'movie') => {
  const { data } = await api.get(`/${mediaType}/${id}`);
  return data;
};

export default api;
