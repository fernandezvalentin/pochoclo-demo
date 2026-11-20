import React from 'react';
import './Logo.css';

interface LogoProps {
  className?: string;
  onClick?: () => void;
}

// Wordmark en texto (sin imágenes externas que puedan fallar al cargar).
const Logo: React.FC<LogoProps> = ({ className = '', onClick }) => (
  <span
    className={`logo ${onClick ? 'logo--clickable' : ''} ${className}`}
    onClick={onClick}
    role={onClick ? 'link' : 'img'}
    aria-label="Netflix Clone"
  >
    NETFLIX
  </span>
);

export default Logo;
