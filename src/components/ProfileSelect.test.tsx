import { afterEach, describe, expect, it, vi } from 'vitest';
import { act, fireEvent, render, screen } from '@testing-library/react';
import ProfileSelect from './ProfileSelect';
import { PROFILES } from '../data/profiles';

describe('ProfileSelect', () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it('muestra todos los perfiles', () => {
    render(<ProfileSelect onSelect={vi.fn()} />);
    expect(screen.getByRole('heading', { name: '¿Quién está viendo ahora?' })).toBeInTheDocument();
    for (const profile of PROFILES) {
      expect(screen.getByRole('button', { name: new RegExp(profile.name) })).toBeInTheDocument();
    }
  });

  it('muestra el spinner y después entra con el perfil elegido', () => {
    vi.useFakeTimers();
    const onSelect = vi.fn();
    render(<ProfileSelect onSelect={onSelect} />);

    fireEvent.click(screen.getByRole('button', { name: /Invitado/ }));
    expect(screen.getByLabelText('Cargando')).toBeInTheDocument();
    expect(onSelect).not.toHaveBeenCalled();

    act(() => vi.advanceTimersByTime(1000));
    expect(onSelect).toHaveBeenCalledWith(expect.objectContaining({ id: 'invitado' }));
  });
});
