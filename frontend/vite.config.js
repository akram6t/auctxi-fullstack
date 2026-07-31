import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  return {
    plugins: [react(), tailwindcss()],
  server: {
    port: 5173,
    host: '0.0.0.0',       // Force listening on all local network paths
    strictPort: true,      // Fail if port 5173 is occupied instead of picking a random one
    allowedHosts: true,    // Stops security blocks originating from trycloudflare.com
    // hmr: {
    //   protocol: 'wss',     // Force secure WebSockets for hot module reloading
    //   clientPort: 443,     // Direct HMR traffic safely over the cloudflare SSL layer
    // },
    proxy: {
      '/api': {
        target: env.VITE_API_GATEWAY_URL || 'http://localhost:3000',
        changeOrigin: true,
        ws: true,
      },
    },
    },
  };
});