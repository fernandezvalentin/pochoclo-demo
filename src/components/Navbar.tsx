import React, { useState, useEffect, useRef } from 'react';
import { Bell, ChevronDown, Search } from 'lucide-react';
import Avatar from './Avatar';
import Logo from './Logo';
import { PROFILES, type Profile } from '../data/profiles';
import './Navbar.css';

export type View = 'home' | 'series' | 'movies';

interface NavbarProps {
  activeView: View;
  onViewChange: (view: View) => void;
  profile: Profile;
  onProfileChange: (profile: Profile) => void;
  onSwitchProfile: () => void;
}

const LINKS: { label: string; view?: View }[] = [
  { label: 'Inicio', view: 'home' },
  { label: 'Series', view: 'series' },
  { label: 'Películas', view: 'movies' },
  { label: 'Novedades populares' },
  { label: 'Mi lista' },
];

const Navbar: React.FC<NavbarProps> = ({ activeView, onViewChange, profile, onProfileChange, onSwitchProfile }) => {
  const [solid, setSolid] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 80);
    onScroll();
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    const onClick = (e: MouseEvent) => {
      if (!menuRef.current?.contains(e.target as Node)) setMenuOpen(false);
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, [menuOpen]);

  const otherProfiles = PROFILES.filter((p) => p.id !== profile.id);

  return (
    <nav className={`nav ${solid ? 'nav--solid' : ''}`}>
      <div className="nav__contents">
        <Logo onClick={() => onViewChange('home')} />
        <div className="nav__links">
          {LINKS.map(({ label, view }) => (
            <span
              key={label}
              className={`${view && activeView === view ? 'active' : ''} ${view ? '' : 'nav__link--disabled'}`}
              onClick={() => view && onViewChange(view)}
            >
              {label}
            </span>
          ))}
        </div>
        <div className="nav__right">
          <Search size={22} className="nav__icon" />
          <span className="nav__kids">Niños</span>
          <Bell size={22} className="nav__icon" />
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
