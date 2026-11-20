import React from 'react';
import { Plus } from 'lucide-react';
import type { Movie } from '../types/movie';
import TitleGrid from './TitleGrid';
import './Page.css';

interface MyListProps {
  movies: Movie[];
  onMovieClick: (movie: Movie) => void;
}

const MyList: React.FC<MyListProps> = ({ movies, onMovieClick }) => (
  <section className="page">
    <h1 className="page__title">Mi lista</h1>
    {movies.length === 0 ? (
      <div className="page__empty">
        <p>Todavía no agregaste títulos a tu lista.</p>
        <p className="page__empty-tip">
          Abrí cualquier película o serie y tocá <span className="page__plus"><Plus size={14} /></span> para guardarla acá.
        </p>
      </div>
    ) : (
      <TitleGrid movies={movies} onMovieClick={onMovieClick} />
    )}
  </section>
);

export default MyList;
