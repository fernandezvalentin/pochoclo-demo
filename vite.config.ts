/// <reference types="vitest/config" />
import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import { buildTmdbUrl, TMDB_ORIGIN } from './api/_tmdb.js'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // En desarrollo, el servidor de Vite hace de proxy igual que la función de Vercel:
  // la key se lee de .env (TMDB_API_KEY, sin prefijo VITE_) y no llega al navegador.
  const { TMDB_API_KEY = '' } = loadEnv(mode, process.cwd(), '')
  const toTmdb = (path: string) => {
    const url = new URL(path, 'http://localhost')
    return buildTmdbUrl(url.pathname.replace(/^\/api\/tmdb/, ''), url.searchParams, TMDB_API_KEY)
  }

  return {
    plugins: [react()],
    server: {
      proxy: {
        '/api/tmdb': {
          target: TMDB_ORIGIN,
          changeOrigin: true,
          // Rutas no permitidas: devolver 404 sin llegar a TMDB.
          bypass: (req) => (toTmdb(req.url ?? '') ? undefined : false),
          rewrite: (path) => {
            const target = toTmdb(path)!
            return target.pathname + target.search
          },
        },
      },
    },
    test: {
      environment: 'jsdom',
      setupFiles: ['./src/test/setup.ts'],
      css: false,
    },
  }
})
