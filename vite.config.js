import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  base: '/mc-workbench/',
  plugins: [react()],
  server: { port: 3001 }
})
