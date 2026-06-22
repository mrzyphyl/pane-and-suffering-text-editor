import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [
    react(),
    {
      name: 'serve-html-from-index',
      configureServer(server) {
        server.middlewares.use((req, _res, next) => {
          if (req.url === '/index.html' || req.url === '/') {
            req.url = '/index/index.html';
          }
          next();
        });
      },
    },
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  build: {
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, 'index/index.html'),
      },
    },
  },
});
