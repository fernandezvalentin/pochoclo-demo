import React, { useState, useEffect, useRef } from 'react';
import api, { imageUrl } from '../services/api';
import type { Movie } from '../types/movie';
import './Row.css';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface RowProps {
  title: string;
  fetchUrl: string;
  isLargeRow?: boolean;
  isTop10?: boolean;
  onMovieClick: (movie: Movie) => void;
}

const SKELETON_COUNT = 8;

const Row: React.FC<RowProps> = ({ title, fetchUrl, isLargeRow: large, isTop10, onMovieClick }) => {
  const isLargeRow = large || isTop10;
  const [movies, setMovies] = useState<Movie[] | null>(null);
  const rowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cancelled = false;
    api.get(fetchUrl)
      .then(({ data }) => {
        if (cancelled) return;
        const results: Movie[] = data.results ?? [];
        const usable = results.filter((m) => (isLargeRow ? m.poster_path : m.backdrop_path));
        setMovies(isTop10 ? usable.slice(0, 10) : usable);
      })
      .catch((error) => {
        console.error(`Error al cargar la fila "${title}":`, error);
        if (!cancelled) setMovies([]);
      });
    return () => { cancelled = true; };
  }, [fetchUrl, title, isLargeRow, isTop10]);

  const scroll = (direction: 'left' | 'right') => {
    const el = rowRef.current;
    if (!el) return;
    const delta = el.clientWidth * 0.9 * (direction === 'left' ? -1 : 1);
    el.scrollBy({ left: delta, behavior: 'smooth' });
  };

  // Si la API no devolvió nada, no mostramos una fila vacía.
  if (movies && movies.length === 0) return null;

  return (
    <section className={`row ${isLargeRow ? 'row--large' : ''} ${isTop10 ? 'row--top10' : ''}`}>
      <h2 className="row__title">{title}</h2>
      <div className="row__container">
        <button className="row__arrow row__arrow--left" onClick={() => scroll('left')} aria-label="Anterior">
          <ChevronLeft size={36} />
        </button>

        <div className="row__posters" ref={rowRef}>
          {movies
            ? movies.map((movie, index) => {
                const name = movie.title || movie.name || movie.original_name || '';
                return (
                  <button
                    key={movie.id}
                    className="row__card"
                    onClick={() => onMovieClick(movie)}
                    title={name}
                  >
                    {isTop10 && <span className="row__rank" aria-hidden="true">{index + 1}</span>}
                    <img
                      className="row__poster"
                      src={imageUrl(isLargeRow ? movie.poster_path : movie.backdrop_path, isLargeRow ? 'w500' : 'w780')}
                      alt={name}
                      loading="lazy"
                    />
                    {!isLargeRow && <span className="row__card-title">{name}</span>}
                  </button>
                );
              })
            : Array.from({ length: SKELETON_COUNT }, (_, i) => (
                <div key={i} className="row__card row__card--skeleton" />
              ))}
        </div>

        <button className="row__arrow row__arrow--right" onClick={() => scroll('right')} aria-label="Siguiente">
          <ChevronRight size={36} />
        </button>
      </div>
    </section>
  );
};

export default Row;
