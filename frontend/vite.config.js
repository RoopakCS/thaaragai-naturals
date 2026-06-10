import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import viteCompression from 'vite-plugin-compression'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    viteCompression({
      algorithm: 'gzip',
      ext: '.gz',
    }),
    viteCompression({
      algorithm: 'brotliCompress',
      ext: '.br',
    }),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', '180x180.png', 'Tharagai.png'],
      manifest: {
        name: 'Thaaragai Naturals',
        short_name: 'Thaaragai',
        description: 'Experience the pure essence of traditional Tamil wisdom, crafted with love in Ramanathapuram.',
        theme_color: '#a8d3b8',
        background_color: '#041209',
        display: 'standalone',
        icons: [
          {
            src: '192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: '512x512.png',
            sizes: '512x512',
            type: 'image/png'
          },
          {
            src: '512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ]
      }
    })
  ],
  server: {
    headers: {
      'Cross-Origin-Opener-Policy': 'same-origin-allow-popups'
    }
  }
})
