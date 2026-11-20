import React, { useState, useEffect } from 'react';
import api, { imageUrl } from '../services/api';
import type { Movie } from '../types/movie';
import { Play, Info } from 'lucide-react';
import './Hero.css';

interface HeroProps {
  fetchUrl: string;
  onMoreInfo: (movie: Movie) => void;
}

const truncate = (text: string, n: number) =>
  text.length > n ? text.slice(0, n - 1).trimEnd() + '…' : text;

const Hero: React.FC<HeroProps> = ({ fetchUrl, onMoreInfo }) => {
  const [movie, setMovie] = useState<Movie | null>(null);

  useEffect(() => {
    let cancelled = false;
    api.get(fetchUrl)
      .then(({ data }) => {
        const candidates: Movie[] = (data.results ?? []).filter((m: Movie) => m.backdrop_path && m.overview);
        if (!cancelled && candidates.length > 0) {
          setMovie(candidates[Math.floor(Math.random() * candidates.length)]);
        }
      })
      .catch((error) => console.error('Error al cargar el destacado:', error));
    return () => { cancelled = true; };
  }, [fetchUrl]);

  return (
    <header
      className={`hero ${movie ? 'hero--loaded' : ''}`}
      style={movie ? { backgroundImage: `url("${imageUrl(movie.backdrop_path)}")` } : undefined}
    >
      <div className="hero__vignette" />
      {movie && (
        <div className="hero__contents">
          <h1 className="hero__title">
            {movie.title || movie.name || movie.original_name}
          </h1>
          <p className="hero__description">{truncate(movie.overview, 180)}</p>
          <div className="hero__buttons">
            <button className="hero__button hero__button--white" onClick={() => onMoreInfo(movie)}>
              <Play fill="black" size={24} />Reproducir
            </button>
            <button className="hero__button hero__button--grey" onClick={() => onMoreInfo(movie)}>
              <Info size={24} />Más información
            </button>
          </div>
        </div>
      )}
      <div className="hero--fadeBottom" />
    </header>
  );
};

export default Hero;
