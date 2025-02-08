import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    {
      name: 'remove-client-directive',
      transform (code, id) {
        if (id.includes('node_modules/@mui/base')) {
          return code.replace(/"use client";?/g, '')
        }
      }
    }
  ],
  server: { port: 3001 },
  assetsInclude: ['**/*.csv'],
  base: './',
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  }
})
