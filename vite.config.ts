import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// In the browser the app always calls relative `/admin/*` URLs (see
// src/api/client.ts). Two different mechanisms point those at a real API:
//   • dev  — this Vite proxy forwards /admin, /config, /health to
//            VITE_PROXY_TARGET (default: the local API on :3030).
//   • prod — there is no dev server, so the static bundle must call an
//            ABSOLUTE url: set VITE_API_BASE instead (see .env.production).
// loadEnv() is required: vite.config does NOT see .env values via process.env,
// so without it VITE_PROXY_TARGET from a .env file is silently ignored.
// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), 'VITE_')
  const apiTarget = env.VITE_PROXY_TARGET || 'http://localhost:3030'

  return {
    plugins: [react()],
    server: {
      proxy: {
        '/admin': apiTarget,
        '/public': apiTarget,
        '/config': apiTarget,
        '/health': apiTarget,
      },
    },
  }
})
