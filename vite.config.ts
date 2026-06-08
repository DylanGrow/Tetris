import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  base: '/Tetris/',
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'favicon.svg', 'apple-touch-icon.png', 'robots.txt'],
      manifest: {
        name: 'TETRIS ARCADE — Block Drop Zone',
        short_name: 'TETRIS ARCADE',
        description: 'A retro Tetris arcade experience. Drop blocks, clear lines, dominate the leaderboard.',
        theme_color: '#050510',
        background_color: '#050510',
        display: 'standalone',
        orientation: 'portrait',
        scope: '/Tetris/',
        start_url: '/Tetris/',
        icons: [
          { src: 'pwa-192.png', sizes: '192x192', type: 'image/png' },
          { src: 'pwa-512.png', sizes: '512x512', type: 'image/png' },
          { src: 'pwa-512.png', sizes: '512x512', type: 'image/png', purpose: 'any maskable' },
        ],
        categories: ['games', 'entertainment'],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
        runtimeCaching: [],
        navigateFallback: '/Tetris/index.html',
      },
    }),
  ],
  build: {
    target: 'es2015',
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          if (id.includes('node_modules/react')) return 'react';
        },
      },
    },
  },
});
