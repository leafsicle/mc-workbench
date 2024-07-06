import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: { port: 3001 },
  base: process.env.NODE_ENV === 'production' ? '/mc-workbench/' : '/'
})
