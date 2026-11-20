export interface Profile {
  id: string;
  name: string;
  color: string;
  kids?: boolean;
}

export const PROFILES: Profile[] = [
  { id: 'valentin', name: 'Valentín', color: '#2b6de8' },
  { id: 'invitado', name: 'Invitado', color: '#e5a00d' },
  { id: 'demo', name: 'Demo', color: '#e50914' },
  { id: 'ninos', name: 'Niños', color: '#22a35a', kids: true },
];

const STORAGE_KEY = 'netflix-clone:profile';

export const loadProfile = (): Profile | null => {
  try {
    const id = localStorage.getItem(STORAGE_KEY);
    return PROFILES.find((p) => p.id === id) ?? null;
  } catch {
    return null;
  }
};

export const saveProfile = (profile: Profile | null) => {
  try {
    if (profile) localStorage.setItem(STORAGE_KEY, profile.id);
    else localStorage.removeItem(STORAGE_KEY);
  } catch {
    /* almacenamiento no disponible: el perfil vive solo en memoria */
  }
};
