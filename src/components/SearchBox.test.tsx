import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SearchBox from './SearchBox';

describe('SearchBox', () => {
  it('se abre con la lupa y no pierde letras aunque el valor externo llegue tarde', async () => {
    const onChange = vi.fn();
    // value queda fijo en '' para simular que la URL todavía no se actualizó.
    render(<SearchBox value="" onChange={onChange} />);

    await userEvent.click(screen.getByRole('button', { name: 'Buscar' }));
    await userEvent.type(screen.getByRole('searchbox', { name: 'Buscar títulos' }), 'mar');

    expect(screen.getByRole('searchbox')).toHaveValue('mar');
    expect(onChange).toHaveBeenLastCalledWith('mar');
  });

  it('Escape borra la búsqueda y cierra el campo', async () => {
    const onChange = vi.fn();
    render(<SearchBox value="matrix" onChange={onChange} />);

    await userEvent.type(screen.getByRole('searchbox'), '{Escape}');
    expect(onChange).toHaveBeenLastCalledWith('');
    expect(screen.queryByRole('searchbox')).not.toBeInTheDocument();
  });
});
