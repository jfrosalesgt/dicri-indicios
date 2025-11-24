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
  build: {
    // ✅ Source maps para debug en producción
    sourcemap: true,
    // ✅ Optimizaciones de build
    rollupOptions: {
      output: {
        manualChunks: {
          // Separar vendors grandes
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'mui-vendor': ['@mui/material', '@mui/icons-material'],
          'redux-vendor': ['@reduxjs/toolkit', 'react-redux', 'redux-persist'],
        },
      },
    },
    // ✅ Chunk size warnings
    chunkSizeWarningLimit: 1000,
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