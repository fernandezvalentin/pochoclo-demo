import { describe, expect, it } from 'vitest';
import { act, renderHook } from '@testing-library/react';
import { useMyList } from './useMyList';
import { makeMovie } from '../test/fixtures';

describe('useMyList', () => {
  it('agrega y quita títulos', () => {
    const { result } = renderHook(() => useMyList('demo'));
    const movie = makeMovie(1);

    act(() => result.current.toggle(movie));
    expect(result.current.isInList(1)).toBe(true);
    expect(result.current.list).toHaveLength(1);

    act(() => result.current.toggle(movie));
    expect(result.current.isInList(1)).toBe(false);
    expect(result.current.list).toHaveLength(0);
  });

  it('pone primero el último título agregado', () => {
    const { result } = renderHook(() => useMyList('demo'));
    act(() => result.current.toggle(makeMovie(1)));
    act(() => result.current.toggle(makeMovie(2)));
    expect(result.current.list.map((m) => m.id)).toEqual([2, 1]);
  });

  it('guarda la lista en localStorage y la separa por perfil', () => {
    const first = renderHook(() => useMyList('demo'));
    act(() => first.result.current.toggle(makeMovie(7)));

    // Al volver a montar, la lista se lee de localStorage.
    expect(renderHook(() => useMyList('demo')).result.current.isInList(7)).toBe(true);
    // Otro perfil tiene su propia lista.
    expect(renderHook(() => useMyList('ninos')).result.current.list).toEqual([]);
  });

  it('no se rompe si localStorage tiene datos inválidos', () => {
    localStorage.setItem('pochoclo:list:demo', '{no es json');
    expect(renderHook(() => useMyList('demo')).result.current.list).toEqual([]);
  });
});
