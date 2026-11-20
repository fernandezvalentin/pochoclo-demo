import React from 'react';
import './Footer.css';

const LINKS = [
  'Audio descriptivo', 'Centro de ayuda', 'Tarjetas de regalo', 'Prensa',
  'Relaciones con inversionistas', 'Empleo', 'Términos de uso', 'Privacidad',
  'Avisos legales', 'Preferencias de cookies', 'Información corporativa', 'Contáctanos',
];

const Footer: React.FC = () => (
  <footer className="footer">
    <ul className="footer__links">
      {LINKS.map((link) => (
        <li key={link}><span>{link}</span></li>
      ))}
    </ul>
    <p className="footer__disclaimer">
      Proyecto de demostración con fines educativos y de portfolio. No está afiliado a Netflix.
      Datos e imágenes provistos por{' '}
      <a href="https://www.themoviedb.org/" target="_blank" rel="noreferrer">TMDB</a>.
    </p>
  </footer>
);

export default Footer;
