import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 5173,
    host: true, // Expone el servidor a la red de Docker
    // --- AGREGADO: SONDEO DE ARCHIVOS PARA DOCKER EN WINDOWS ---
    watch: {
      usePolling: true,
    },
    // -----------------------------------------------------------
  },
  preview: {
    port: 4173,
    host: true,
  },
})