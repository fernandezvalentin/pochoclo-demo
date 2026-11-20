import React, { useState, useEffect, useRef } from 'react';
import { ChevronDown } from 'lucide-react';
import Avatar from './Avatar';
import Logo from './Logo';
import SearchBox from './SearchBox';
import Notifications from './Notifications';
import { Link } from 'react-router';
import { PROFILES, type Profile } from '../data/profiles';
import { VIEW_PATHS, type View } from '../routes';
import type { Movie } from '../types/movie';
import './Navbar.css';

interface NavbarProps {
  activeView: View | null;
  onViewChange: (view: View) => void;
  profile: Profile;
  onProfileChange: (profile: Profile) => void;
  onSwitchProfile: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onOpenTitle: (movie: Movie) => void;
}

const LINKS: { label: string; view: View }[] = [
  { label: 'Inicio', view: 'home' },
  { label: 'Series', view: 'series' },
  { label: 'Películas', view: 'movies' },
  { label: 'Novedades populares', view: 'new' },
  { label: 'Mi lista', view: 'mylist' },
];

// Cierra un desplegable al hacer clic afuera o con Escape.
const useDismiss = (open: boolean, close: () => void) => {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) close();
    };
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && close();
    document.addEventListener('mousedown', onClick);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onClick);
      document.removeEventListener('keydown', onKey);
    };
  }, [open, close]);
  return ref;
};

const Navbar: React.FC<NavbarProps> = ({
  activeView, onViewChange, profile, onProfileChange, onSwitchProfile,
  searchQuery, onSearchChange, onOpenTitle,
}) => {
  const [solid, setSolid] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [browseOpen, setBrowseOpen] = useState(false);
  const menuRef = useDismiss(menuOpen, () => setMenuOpen(false));
  const browseRef = useDismiss(browseOpen, () => setBrowseOpen(false));

  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 80);
    onScroll();
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const otherProfiles = PROFILES.filter((p) => p.id !== profile.id);
  const activeLabel = LINKS.find((l) => l.view === activeView)?.label ?? 'Explorar';

  return (
    <nav className={`nav ${solid || searchQuery ? 'nav--solid' : ''}`}>
      <div className="nav__contents">
        <Logo onClick={() => onViewChange('home')} />

        <div className="nav__links">
          {LINKS.map(({ label, view }) => (
            <Link
              key={view}
              to={VIEW_PATHS[view]}
              className={activeView === view ? 'active' : ''}
              aria-current={activeView === view ? 'page' : undefined}
            >
              {label}
            </Link>
          ))}
        </div>

        <div className="nav__browse" ref={browseRef}>
          <button className="nav__browse-btn" onClick={() => setBrowseOpen((o) => !o)} aria-expanded={browseOpen}>
            {activeLabel} <ChevronDown size={14} />
          </button>
          {browseOpen && (
            <div className="nav__browse-menu">
              {LINKS.map(({ label, view }) => (
                <Link
                  key={view}
                  to={VIEW_PATHS[view]}
                  className={activeView === view ? 'active' : ''}
                  onClick={() => setBrowseOpen(false)}
                >
                  {label}
                </Link>
              ))}
            </div>
          )}
        </div>

        <div className="nav__right">
          <SearchBox value={searchQuery} onChange={onSearchChange} />
          {profile.kids && <span className="nav__kids">Niños</span>}
          <Notifications profileId={profile.id} kids={profile.kids} onOpenTitle={onOpenTitle} />
          <div className="nav__profile" ref={menuRef}>
            <button
              className="nav__profile-btn"
              onClick={() => setMenuOpen((o) => !o)}
              aria-label="Menú de perfil"
              aria-expanded={menuOpen}
            >
              <Avatar profile={profile} size={32} />
              <ChevronDown size={16} className={`nav__caret ${menuOpen ? 'nav__caret--open' : ''}`} />
            </button>
            {menuOpen && (
              <div className="nav__menu">
                {otherProfiles.map((p) => (
                  <button
                    key={p.id}
                    className="nav__menu-item"
                    onClick={() => { setMenuOpen(false); onProfileChange(p); }}
                  >
                    <Avatar profile={p} size={32} />
                    <span>{p.name}</span>
                  </button>
                ))}
                <div className="nav__menu-sep" />
                <button className="nav__menu-item nav__menu-item--center" onClick={() => { setMenuOpen(false); onSwitchProfile(); }}>
                  Cambiar de perfil
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
