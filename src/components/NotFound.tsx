import React from 'react';
import { Link } from 'react-router';
import './Page.css';

const NotFound: React.FC = () => (
  <section className="page page--center">
    <h1 className="page__title">¿Te perdiste?</h1>
    <p className="page__hint">No encontramos esa página. Hay mucho más para ver en el inicio.</p>
    <Link to="/" className="page__cta">Ir al inicio</Link>
  </section>
);

export default NotFound;
