import { useCallback, useState } from 'react';
import type { Movie } from '../types/movie';

const keyFor = (profileId: string) => `pochoclo:list:${profileId}`;

const read = (profileId: string): Movie[] => {
  try {
    const raw = localStorage.getItem(keyFor(profileId));
    return raw ? (JSON.parse(raw) as Movie[]) : [];
  } catch {
    return [];
  }
};

// "Mi lista" guardada por perfil en localStorage.
// App se vuelve a montar al cambiar de perfil (key={profile.id}), así que la lista se relee sola.
export const useMyList = (profileId: string) => {
  const [list, setList] = useState<Movie[]>(() => read(profileId));

  const persist = (next: Movie[]) => {
    try {
      localStorage.setItem(keyFor(profileId), JSON.stringify(next));
    } catch {
      /* sin almacenamiento: la lista vive solo en memoria */
    }
  };

  const isInList = useCallback((id: number) => list.some((m) => m.id === id), [list]);

  const toggle = useCallback((movie: Movie) => {
    setList((prev) => {
      const next = prev.some((m) => m.id === movie.id)
        ? prev.filter((m) => m.id !== movie.id)
        : [movie, ...prev];
      persist(next);
      return next;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profileId]);

  return { list, isInList, toggle };
};
