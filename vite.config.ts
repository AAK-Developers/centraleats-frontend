import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Capacitor necesita rutas relativas (no absolutas) para servir bien
// los assets dentro del WebView de Android.
export default defineConfig({
  plugins: [react()],
  base: './',
})
