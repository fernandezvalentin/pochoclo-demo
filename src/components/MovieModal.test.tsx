import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import MovieModal from './MovieModal';
import { makeMovie } from '../test/fixtures';

describe('MovieModal', () => {
  const movie = makeMovie(1, { title: 'Matrix', genre_ids: [28, 878], vote_average: 8.2, release_date: '1999-03-31' });

  it('muestra los datos del título con los géneros en español', () => {
    render(<MovieModal movie={movie} onClose={vi.fn()} inList={false} onToggleList={vi.fn()} />);
    expect(screen.getByRole('dialog', { name: 'Matrix' })).toBeInTheDocument();
    expect(screen.getByText('Acción, Ciencia ficción')).toBeInTheDocument();
    expect(screen.getByText('82% para ti')).toBeInTheDocument();
    expect(screen.getByText('1999')).toBeInTheDocument();
  });

  it('agrega o quita el título de Mi lista', async () => {
    const onToggleList = vi.fn();
    const { rerender } = render(<MovieModal movie={movie} onClose={vi.fn()} inList={false} onToggleList={onToggleList} />);

    await userEvent.click(screen.getByRole('button', { name: 'Agregar a Mi lista' }));
    expect(onToggleList).toHaveBeenCalledWith(movie);

    rerender(<MovieModal movie={movie} onClose={vi.fn()} inList onToggleList={onToggleList} />);
    expect(screen.getByRole('button', { name: 'Quitar de Mi lista' })).toBeInTheDocument();
  });

  it('se cierra con Escape, con la X y al hacer clic afuera', async () => {
    const onClose = vi.fn();
    const { container } = render(<MovieModal movie={movie} onClose={onClose} inList={false} onToggleList={vi.fn()} />);

    await userEvent.keyboard('{Escape}');
    await userEvent.click(screen.getByRole('button', { name: 'Cerrar' }));
    await userEvent.click(container.querySelector('.modal__overlay')!);
    expect(onClose).toHaveBeenCalledTimes(3);
  });

  it('bloquea el scroll de la página mientras está abierto', () => {
    const { unmount } = render(<MovieModal movie={movie} onClose={vi.fn()} inList={false} onToggleList={vi.fn()} />);
    expect(document.body.style.overflow).toBe('hidden');
    unmount();
    expect(document.body.style.overflow).toBe('');
  });
});
