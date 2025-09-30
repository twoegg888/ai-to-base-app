import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './'),
    },
  },

  build: {
    outDir: 'dist',
    sourcemap: false,
    minify: true,
    target: 'es2015',
  },
  server: {
    port: 3000,
    open: true,
  },
  preview: {
    port: 3001,
    open: true,
    host: true,
  },
})