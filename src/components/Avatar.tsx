import React from 'react';
import type { Profile } from '../data/profiles';

interface AvatarProps {
  profile: Profile;
  size?: number;
  className?: string;
}

// Avatar dibujado en SVG (sin imágenes externas): fondo de color con una carita.
const Avatar: React.FC<AvatarProps> = ({ profile, size = 32, className }) => (
  <svg
    className={className}
    width={size}
    height={size}
    viewBox="0 0 100 100"
    role="img"
    aria-label={profile.name}
    style={{ borderRadius: size > 60 ? 6 : 4, display: 'block' }}
  >
    <rect width="100" height="100" fill={profile.color} />
    {profile.kids ? (
      <text x="50" y="62" textAnchor="middle" fontSize="30" fontWeight="900" fill="#fff" fontFamily="Arial, sans-serif">
        niños
      </text>
    ) : (
      <>
        <rect x="28" y="32" width="9" height="16" rx="2" fill="#fff" />
        <rect x="63" y="32" width="9" height="16" rx="2" fill="#fff" />
        <path d="M24 62 Q50 84 76 62" stroke="#fff" strokeWidth="7" fill="none" strokeLinecap="round" />
      </>
    )}
  </svg>
);

export default Avatar;
