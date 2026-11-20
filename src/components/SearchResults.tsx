import React, { useEffect, useState } from 'react';
import { searchTitles } from '../services/api';
import { useDebounce } from '../hooks/useDebounce';
import type { Movie } from '../types/movie';
import TitleGrid from './TitleGrid';
import './Page.css';

interface SearchResultsProps {
  query: string;
  kids?: boolean;
  onMovieClick: (movie: Movie) => void;
}

const KIDS_GENRES = [16, 10751, 10762];

const SearchResults: React.FC<SearchResultsProps> = ({ query, kids, onMovieClick }) => {
  const debounced = useDebounce(query.trim(), 400);
  const [state, setState] = useState<{ query: string; results: Movie[]; error?: boolean } | null>(null);

  useEffect(() => {
    if (!debounced) return;
    const controller = new AbortController();
    searchTitles(debounced, controller.signal)
      .then((results: Movie[]) => {
        const titles = results.filter(
          (m) => (m.media_type === 'movie' || m.media_type === 'tv') && (m.backdrop_path || m.poster_path),
        );
        setState({
          query: debounced,
          results: kids ? titles.filter((m) => m.genre_ids?.some((g) => KIDS_GENRES.includes(g))) : titles,
        });
      })
      .catch((error) => {
        if (controller.signal.aborted) return;
        console.error('Error en la búsqueda:', error);
        setState({ query: debounced, results: [], error: true });
      });
    return () => controller.abort();
  }, [debounced, kids]);

  const loading = !state || state.query !== debounced || debounced !== query.trim();

  return (
    <section className="page">
      {loading ? (
        <p className="page__hint">Buscando “{query.trim()}”…</p>
      ) : state.error ? (
        <p className="page__hint">No pudimos completar la búsqueda. Probá de nuevo en un momento.</p>
      ) : state.results.length === 0 ? (
        <div className="page__empty">
          <p>Tu búsqueda de “{state.query}” no tuvo coincidencias.</p>
          <ul>
            <li>Probá con otras palabras.</li>
            <li>Buscá por el título de una película o serie.</li>
          </ul>
        </div>
      ) : (
        <>
          <p className="page__hint">Resultados para “{state.query}”</p>
          <TitleGrid movies={state.results} onMovieClick={onMovieClick} />
        </>
      )}
    </section>
  );
};

export default SearchResults;
