import React from 'react';
import { imageUrl } from '../services/api';
import type { Movie } from '../types/movie';
import './TitleGrid.css';

interface TitleGridProps {
  movies: Movie[];
  onMovieClick: (movie: Movie) => void;
}

// Grilla de títulos para Búsqueda y Mi lista.
const TitleGrid: React.FC<TitleGridProps> = ({ movies, onMovieClick }) => (
  <div className="grid">
    {movies.map((movie) => {
      const name = movie.title || movie.name || movie.original_name || '';
      const image = movie.backdrop_path || movie.poster_path;
      return (
        <button key={`${movie.media_type ?? ''}-${movie.id}`} className="grid__card" onClick={() => onMovieClick(movie)} title={name}>
          {image ? (
            <img src={imageUrl(image, 'w780')} alt={name} loading="lazy" className={movie.backdrop_path ? '' : 'grid__img--poster'} />
          ) : (
            <span className="grid__placeholder">{name}</span>
          )}
          <span className="grid__title">{name}</span>
        </button>
      );
    })}
  </div>
);

export default TitleGrid;
