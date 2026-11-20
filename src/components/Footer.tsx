import React from 'react';
import Logo from './Logo';
import './Footer.css';

const Footer: React.FC = () => (
  <footer className="footer">
    <Logo className="footer__logo" />
    <p className="footer__disclaimer">
      Pochoclo es un proyecto de portfolio con fines educativos: no es un servicio real
      de streaming y no pide ni guarda datos personales.
    </p>
    <p className="footer__credits">
      Datos e imágenes provistos por{' '}
      <a href="https://www.themoviedb.org/" target="_blank" rel="noreferrer">TMDB</a>.
      Este producto usa la API de TMDB pero no está avalado ni certificado por TMDB.
    </p>
  </footer>
);

export default Footer;
