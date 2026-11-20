import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import Avatar from './Avatar';
import Logo from './Logo';
import { PROFILES, type Profile } from '../data/profiles';
import './ProfileSelect.css';

interface ProfileSelectProps {
  onSelect: (profile: Profile) => void;
}

const ProfileSelect: React.FC<ProfileSelectProps> = ({ onSelect }) => {
  const [loading, setLoading] = useState<Profile | null>(null);

  const handleSelect = (profile: Profile) => {
    setLoading(profile);
    // Pequeña pausa con spinner, como al entrar a un perfil real.
    setTimeout(() => onSelect(profile), 900);
  };

  if (loading) {
    return (
      <div className="profiles profiles--loading">
        <div className="profiles__spinner" aria-label="Cargando" />
        <Avatar profile={loading} size={56} className="profiles__loading-avatar" />
      </div>
    );
  }

  return (
    <div className="profiles">
      <Logo className="profiles__logo" />
      <div className="profiles__inner">
        <h1 className="profiles__title">¿Quién está viendo ahora?</h1>
        <ul className="profiles__list">
          {PROFILES.map((profile) => (
            <li key={profile.id}>
              <button className="profiles__item" onClick={() => handleSelect(profile)}>
                <Avatar profile={profile} size={150} className="profiles__avatar" />
                <span className="profiles__name">{profile.name}</span>
              </button>
            </li>
          ))}
          <li>
            <button className="profiles__item profiles__item--add" disabled title="Disponible solo en la versión completa">
              <span className="profiles__add">
                <Plus size={64} strokeWidth={1.5} />
              </span>
              <span className="profiles__name">Agregar perfil</span>
            </button>
          </li>
        </ul>
        <button className="profiles__manage" disabled>Administrar perfiles</button>
      </div>
    </div>
  );
};

export default ProfileSelect;
