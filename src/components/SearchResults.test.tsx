import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SearchResults from './SearchResults';
import { searchTitles } from '../services/api';
import { makeMovie } from '../test/fixtures';

vi.mock('../services/api', async (importOriginal) => ({
  ...(await importOriginal<typeof import('../services/api')>()),
  searchTitles: vi.fn(),
}));

const mockedSearch = vi.mocked(searchTitles);

describe('SearchResults', () => {
  beforeEach(() => {
    mockedSearch.mockReset();
  });

  it('muestra solo películas y series (sin personas) y abre el título al hacer clic', async () => {
    mockedSearch.mockResolvedValue([
      makeMovie(1, { title: 'Matrix' }),
      makeMovie(2, { title: undefined, name: 'Dark', media_type: 'tv' }),
      makeMovie(3, { title: 'Keanu Reeves', media_type: 'person' }),
    ]);
    const onMovieClick = vi.fn();
    render(<SearchResults query="ma" onMovieClick={onMovieClick} />);

    expect(screen.getByText(/Buscando/)).toBeInTheDocument();
    expect(await screen.findByText('Matrix')).toBeInTheDocument();
    expect(screen.getByText('Dark')).toBeInTheDocument();
    expect(screen.queryByText('Keanu Reeves')).not.toBeInTheDocument();

    await userEvent.click(screen.getByTitle('Matrix'));
    expect(onMovieClick).toHaveBeenCalledWith(expect.objectContaining({ id: 1 }));
    expect(mockedSearch).toHaveBeenCalledWith('ma', expect.any(AbortSignal));
  });

  it('en el perfil Niños filtra los títulos que no son infantiles', async () => {
    mockedSearch.mockResolvedValue([
      makeMovie(1, { title: 'Toy Story', genre_ids: [16, 10751] }),
      makeMovie(2, { title: 'Terror nocturno', genre_ids: [27] }),
    ]);
    render(<SearchResults query="to" kids onMovieClick={vi.fn()} />);

    expect(await screen.findByText('Toy Story')).toBeInTheDocument();
    expect(screen.queryByText('Terror nocturno')).not.toBeInTheDocument();
  });

  it('avisa cuando no hay resultados', async () => {
    mockedSearch.mockResolvedValue([]);
    render(<SearchResults query="zzz" onMovieClick={vi.fn()} />);
    expect(await screen.findByText(/no tuvo coincidencias/)).toBeInTheDocument();
  });

  it('avisa cuando la búsqueda falla', async () => {
    mockedSearch.mockRejectedValue(new Error('500'));
    vi.spyOn(console, 'error').mockImplementation(() => {});
    render(<SearchResults query="error" onMovieClick={vi.fn()} />);
    expect(await screen.findByText(/No pudimos completar la búsqueda/)).toBeInTheDocument();
  });
});
