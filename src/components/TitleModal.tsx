import React, { useEffect, useState } from 'react';
import { getMovieDetails } from '../services/api';
import type { Movie } from '../types/movie';
import type { MediaType } from '../routes';
import MovieModal from './MovieModal';

interface TitleModalProps {
  type: MediaType;
  id: number;
  // Si el título se abrió desde la app ya lo tenemos; si se entró por link, se pide a la API.
  initialMovie?: Movie;
  onClose: () => void;
  inList: (id: number) => boolean;
  onToggleList: (movie: Movie) => void;
}

interface Details extends Omit<Movie, 'genre_ids'> {
  genres?: { id: number }[];
}

const fromDetails = (data: Details, type: MediaType): Movie => ({
  ...data,
  media_type: type,
  genre_ids: data.genres?.map((g) => g.id) ?? [],
});

const TitleModal: React.FC<TitleModalProps> = ({ type, id, initialMovie, onClose, inList, onToggleList }) => {
  const [fetched, setFetched] = useState<Movie | null>(null);
  const movie = initialMovie?.id === id ? initialMovie : fetched?.id === id ? fetched : null;

  useEffect(() => {
    if (movie) return;
    let cancelled = false;
    getMovieDetails(id, type)
      .then((data: Details) => !cancelled && setFetched(fromDetails(data, type)))
      .catch((error) => {
        console.error('No se pudo cargar el título:', error);
        if (!cancelled) onClose();
      });
    return () => { cancelled = true; };
  }, [id, type, movie, onClose]);

  if (!movie) return null;

  return (
    <MovieModal
      movie={movie}
      onClose={onClose}
      inList={inList(movie.id)}
      onToggleList={onToggleList}
    />
  );
};

export default TitleModal;
