import React, { useEffect } from 'react';
import type { Movie } from '../types/movie';
import { X, Play, Plus, Check, ThumbsUp } from 'lucide-react';
import { imageUrl } from '../services/api';
import { genreNames } from '../data/genres';
import './MovieModal.css';

interface MovieModalProps {
  movie: Movie | null;
  onClose: () => void;
  inList: boolean;
  onToggleList: (movie: Movie) => void;
}

const MovieModal: React.FC<MovieModalProps> = ({ movie, onClose, inList, onToggleList }) => {
  useEffect(() => {
    if (!movie) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', onKey);
    };
  }, [movie, onClose]);

  if (!movie) return null;

  const title = movie.title || movie.name || movie.original_name;
  const year = (movie.release_date || movie.first_air_date || '').split('-')[0];
  const match = movie.vote_average ? Math.round(movie.vote_average * 10) : null;
  const genres = genreNames(movie.genre_ids);
  const isSeries = movie.media_type === 'tv' || (!movie.title && !!movie.name);

  return (
    <div className="modal__overlay" onClick={onClose}>
      <div
        className="modal__content"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label={title}
      >
        <button className="modal__close" onClick={onClose} aria-label="Cerrar">
          <X size={24} />
        </button>

        <div
          className="modal__banner"
          style={{ backgroundImage: `url("${imageUrl(movie.backdrop_path || movie.poster_path, 'w1280')}")` }}
        >
          <div className="modal__banner--fadeBottom" />
          <div className="modal__banner--contents">
            <h1>{title}</h1>
            <div className="modal__actions">
              <button className="modal__btn modal__btn--play">
                <Play fill="black" size={20} /> Reproducir
              </button>
              <button
                className={`modal__btn--round ${inList ? 'modal__btn--active' : ''}`}
                onClick={() => onToggleList(movie)}
                aria-label={inList ? 'Quitar de Mi lista' : 'Agregar a Mi lista'}
                title={inList ? 'Quitar de Mi lista' : 'Agregar a Mi lista'}
              >
                {inList ? <Check size={20} /> : <Plus size={20} />}
              </button>
              <button className="modal__btn--round" aria-label="Me gusta"><ThumbsUp size={18} /></button>
            </div>
          </div>
        </div>

        <div className="modal__details">
          <div className="modal__details--left">
            <p className="modal__info">
              {match !== null && <span className="modal__match">{match}% para ti</span>}
              {year && <span>{year}</span>}
              <span className="modal__hd">HD</span>
              <span className="modal__type">{isSeries ? 'Serie' : 'Película'}</span>
            </p>
            <p className="modal__overview">{movie.overview || 'Sin descripción disponible.'}</p>
          </div>
          <div className="modal__details--right">
            {genres.length > 0 && <p><span>Géneros:</span> {genres.join(', ')}</p>}
            {movie.vote_average > 0 && (
              <p><span>Puntuación TMDB:</span> {movie.vote_average.toFixed(1)} / 10</p>
            )}
            <p><span>Idioma del audio:</span> Español, Inglés</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieModal;
