import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Bell } from 'lucide-react';
import api, { imageUrl, requests } from '../services/api';
import type { Movie } from '../types/movie';
import './Notifications.css';

interface NotificationsProps {
  profileId: string;
  kids?: boolean;
  onOpenTitle: (movie: Movie) => void;
}

interface Item {
  key: string;
  movie: Movie;
  label: string;
  when: string;
}

const seenKey = (profileId: string) => `pochoclo:seen:${profileId}`;

const readSeen = (profileId: string): string[] => {
  try {
    return JSON.parse(localStorage.getItem(seenKey(profileId)) ?? '[]');
  } catch {
    return [];
  }
};

const formatDate = (iso: string) =>
  new Date(`${iso}T12:00:00`).toLocaleDateString('es-AR', { day: 'numeric', month: 'short' });

const relative = (iso: string) => {
  const days = Math.round((Date.now() - new Date(`${iso}T12:00:00`).getTime()) / 86_400_000);
  if (days <= 0) return 'Hoy';
  if (days === 1) return 'Ayer';
  if (days < 7) return `Hace ${days} días`;
  if (days < 30) return `Hace ${Math.floor(days / 7)} sem.`;
  return formatDate(iso);
};

const Notifications: React.FC<NotificationsProps> = ({ profileId, kids, onOpenTitle }) => {
  const [items, setItems] = useState<Item[]>([]);
  const [seen, setSeen] = useState<string[]>(() => readSeen(profileId));
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cancelled = false;
    const today = new Date().toISOString().slice(0, 10);
    const newUrl = kids ? requests.fetchNewKids : requests.fetchNowPlaying;
    const soonUrl = kids ? requests.fetchKidsMovies : requests.fetchUpcoming;

    Promise.all([api.get(newUrl), api.get(soonUrl)])
      .then(([fresh, soon]) => {
        if (cancelled) return;
        const arrivals: Item[] = (fresh.data.results ?? [])
          .filter((m: Movie) => m.backdrop_path && m.release_date && m.release_date <= today)
          .slice(0, 4)
          .map((m: Movie) => ({ key: `new-${m.id}`, movie: m, label: 'Nuevo en Pochoclo', when: relative(m.release_date!) }));
        const upcoming: Item[] = (soon.data.results ?? [])
          .filter((m: Movie) => m.backdrop_path && m.release_date && m.release_date > today)
          .slice(0, 3)
          .map((m: Movie) => ({ key: `soon-${m.id}`, movie: m, label: 'Próximo estreno', when: `Se estrena el ${formatDate(m.release_date!)}` }));
        setItems([...arrivals, ...upcoming]);
      })
      .catch((error) => console.error('Error al cargar notificaciones:', error));
    return () => { cancelled = true; };
  }, [kids]);

  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('mousedown', onClick);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onClick);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const unread = useMemo(() => items.filter((i) => !seen.includes(i.key)).length, [items, seen]);

  const toggle = () => {
    const next = !open;
    setOpen(next);
    if (next && unread > 0) {
      // Al abrir el panel, todas quedan como leídas (el punto rojo se mantiene hasta cerrar).
      const allSeen = Array.from(new Set([...seen, ...items.map((i) => i.key)]));
      try { localStorage.setItem(seenKey(profileId), JSON.stringify(allSeen)); } catch { /* ignorar */ }
      setTimeout(() => setSeen(allSeen), 1500);
    }
  };

  return (
    <div className="notif" ref={ref}>
      <button className="notif__bell" onClick={toggle} aria-label={`Notificaciones${unread ? ` (${unread} sin leer)` : ''}`} aria-expanded={open}>
        <Bell size={22} />
        {unread > 0 && <span className="notif__badge">{unread}</span>}
      </button>
      {open && (
        <div className="notif__panel">
          {items.length === 0 ? (
            <p className="notif__empty">No hay notificaciones nuevas.</p>
          ) : (
            <ul>
              {items.map((item) => (
                <li key={item.key}>
                  <button
                    className={`notif__item ${seen.includes(item.key) ? '' : 'notif__item--unread'}`}
                    onClick={() => { setOpen(false); onOpenTitle(item.movie); }}
                  >
                    <img src={imageUrl(item.movie.backdrop_path, 'w300')} alt="" loading="lazy" />
                    <span className="notif__text">
                      <span className="notif__label">{item.label}</span>
                      <span className="notif__title">{item.movie.title || item.movie.name}</span>
                      <span className="notif__when">{item.when}</span>
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};

export default Notifications;
