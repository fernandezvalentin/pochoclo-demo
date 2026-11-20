import { buildTmdbUrl } from './_tmdb.js';

// Función serverless de Vercel: /api/tmdb/<ruta de TMDB>?<parámetros>
// (vercel.json reescribe esa URL a /api/tmdb?path=/<ruta>).
// La API key vive solo en el servidor (variable TMDB_API_KEY), nunca llega al navegador.
export async function GET(request: Request): Promise<Response> {
  const apiKey = process.env.TMDB_API_KEY;
  if (!apiKey) {
    return Response.json({ error: 'Falta configurar TMDB_API_KEY en el servidor.' }, { status: 500 });
  }

  const { searchParams } = new URL(request.url);
  const target = buildTmdbUrl(searchParams.get('path') ?? '', searchParams, apiKey);
  if (!target) {
    return Response.json({ error: 'Ruta no permitida.' }, { status: 400 });
  }

  try {
    const upstream = await fetch(target, { headers: { accept: 'application/json' } });
    return new Response(await upstream.text(), {
      status: upstream.status,
      headers: {
        'content-type': 'application/json; charset=utf-8',
        // La CDN de Vercel guarda la respuesta 1 hora: menos llamadas a TMDB y respuestas más rápidas.
        'cache-control': upstream.ok ? 'public, s-maxage=3600, stale-while-revalidate=86400' : 'no-store',
      },
    });
  } catch {
    return Response.json({ error: 'No se pudo conectar con TMDB.' }, { status: 502 });
  }
}
