import React from 'react';
import './Logo.css';

interface LogoProps {
  className?: string;
  onClick?: () => void;
}

// Marca propia: ícono de balde de pochoclos + wordmark.
const Logo: React.FC<LogoProps> = ({ className = '', onClick }) => (
  <span
    className={`logo ${onClick ? 'logo--clickable' : ''} ${className}`}
    onClick={onClick}
    role={onClick ? 'link' : 'img'}
    aria-label="Pochoclo"
  >
    <svg className="logo__icon" viewBox="0 0 64 64" aria-hidden="true">
      <circle cx="20" cy="20" r="10" fill="#fff4d6" />
      <circle cx="32" cy="14" r="11" fill="#fff4d6" />
      <circle cx="44" cy="20" r="10" fill="#fff4d6" />
      <path d="M12 26h40l-6 34H18z" fill="var(--brand)" />
      <path d="M24 26l2 34M32 26v34M40 26l-2 34" stroke="#141414" strokeWidth="3" />
    </svg>
    <span className="logo__text">POCHOCLO</span>
  </span>
);

export default Logo;
