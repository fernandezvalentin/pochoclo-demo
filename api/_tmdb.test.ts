import { afterEach, describe, expect, it, vi } from 'vitest';
import { buildTmdbUrl } from './_tmdb.js';
import { GET } from './tmdb.js';

describe('buildTmdbUrl', () => {
  it('agrega la API key y el idioma a una ruta permitida', () => {
    const url = buildTmdbUrl('/trending/all/week', new URLSearchParams('page=2'), 'secreta');
    expect(url?.origin + url!.pathname).toBe('https://api.themoviedb.org/3/trending/all/week');
    expect(url?.searchParams.get('api_key')).toBe('secreta');
    expect(url?.searchParams.get('language')).toBe('es-ES');
    expect(url?.searchParams.get('page')).toBe('2');
  });

  it('ignora una api_key mandada desde el cliente y el parámetro interno "path"', () => {
    const url = buildTmdbUrl('/movie/603', new URLSearchParams('api_key=otra&path=/movie/603'), 'secreta');
    expect(url?.searchParams.getAll('api_key')).toEqual(['secreta']);
    expect(url?.searchParams.has('path')).toBe(false);
  });

  it.each(['/account/1', '/movie/../account', '', '/authentication/token/new', 'https://evil.com'])(
    'rechaza la ruta %j',
    (path) => {
      expect(buildTmdbUrl(path, new URLSearchParams(), 'secreta')).toBeNull();
    },
  );
});

describe('GET /api/tmdb', () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
  });

  it('responde 500 si falta la API key en el servidor', async () => {
    vi.stubEnv('TMDB_API_KEY', '');
    const res = await GET(new Request('https://app.test/api/tmdb?path=/trending/all/week'));
    expect(res.status).toBe(500);
  });

  it('responde 400 para rutas no permitidas', async () => {
    vi.stubEnv('TMDB_API_KEY', 'secreta');
    const res = await GET(new Request('https://app.test/api/tmdb?path=/account/1'));
    expect(res.status).toBe(400);
  });

  it('reenvía la respuesta de TMDB y la cachea en la CDN', async () => {
    vi.stubEnv('TMDB_API_KEY', 'secreta');
    const fetchMock = vi.fn().mockResolvedValue(new Response('{"results":[]}', { status: 200 }));
    vi.stubGlobal('fetch', fetchMock);

    const res = await GET(new Request('https://app.test/api/tmdb?path=/search/multi&query=matrix'));

    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ results: [] });
    expect(res.headers.get('cache-control')).toContain('s-maxage=3600');
    const calledUrl = new URL(fetchMock.mock.calls[0][0]);
    expect(calledUrl.pathname).toBe('/3/search/multi');
    expect(calledUrl.searchParams.get('query')).toBe('matrix');
    expect(calledUrl.searchParams.get('api_key')).toBe('secreta');
  });
});
