import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router';
import App from './App';
import api, { getMovieDetails } from './services/api';
import { makeMovie } from './test/fixtures';

vi.mock('./services/api', async (importOriginal) => {
  const original = await importOriginal<typeof import('./services/api')>();
  return {
    ...original,
    default: { get: vi.fn() },
    getMovieDetails: vi.fn(),
    searchTitles: vi.fn().mockResolvedValue([]),
  };
});

const renderAt = (url: string) =>
  render(
    <MemoryRouter initialEntries={[url]}>
      <App />
    </MemoryRouter>,
  );

describe('App (rutas)', () => {
  beforeEach(() => {
    vi.mocked(api.get).mockResolvedValue({ data: { results: [makeMovie(1, { title: 'Matrix' })] } });
    localStorage.setItem('pochoclo:profile', 'demo');
  });

  it('sin perfil guardado muestra el selector de perfiles', () => {
    localStorage.clear();
    renderAt('/');
    expect(screen.getByRole('heading', { name: '¿Quién está viendo ahora?' })).toBeInTheDocument();
  });

  it('cada sección tiene su URL y marca el link activo', async () => {
    renderAt('/novedades');
    expect(await screen.findByRole('heading', { name: 'Top 10 de hoy' })).toBeInTheDocument();
    const nav = screen.getByRole('navigation');
    expect(within(nav).getAllByRole('link', { name: 'Novedades populares' })[0]).toHaveAttribute('aria-current', 'page');

    await userEvent.click(within(nav).getAllByRole('link', { name: 'Mi lista' })[0]);
    expect(screen.getByRole('heading', { name: 'Mi lista' })).toBeInTheDocument();
    expect(screen.getByText(/Todavía no agregaste títulos/)).toBeInTheDocument();
  });

  it('abre un título directo desde el link compartido (?titulo=)', async () => {
    vi.mocked(getMovieDetails).mockResolvedValue({
      ...makeMovie(603, { title: 'The Matrix' }),
      genres: [{ id: 878, name: 'Ciencia ficción' }],
    });
    renderAt('/?titulo=movie-603');

    expect(await screen.findByRole('dialog', { name: 'The Matrix' })).toBeInTheDocument();
    expect(getMovieDetails).toHaveBeenCalledWith(603, 'movie');
    expect(screen.getByText('Ciencia ficción')).toBeInTheDocument();
  });

  it('muestra una página 404 para rutas desconocidas', () => {
    renderAt('/no-existe');
    expect(screen.getByRole('heading', { name: '¿Te perdiste?' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Ir al inicio' })).toHaveAttribute('href', '/');
  });
});
