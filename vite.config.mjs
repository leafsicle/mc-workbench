import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import path from "path"
import tailwindcss from "@tailwindcss/vite"

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    {
      name: "remove-client-directive",
      transform(code, id) {
        if (
          id.includes("node_modules/@mui/base") ||
          id.includes("node_modules/@mui/material") ||
          id.includes("node_modules/@mui/lab")
        ) {
          return {
            code: code.replace(/"use client";?/g, ""),
            map: null
          }
        }
      }
    }
  ],
  resolve: {
    alias: {
      "@": path.resolve(path.dirname(new URL(import.meta.url).pathname), "./src")
    }
  },
  server: {
    port: 3001,
    historyApiFallback: true
  },
  base: "https://mattcooke.tech/",
  build: {
    rollupOptions: {
      onwarn(warning, warn) {
        if (warning.code === "MODULE_LEVEL_DIRECTIVE") return
        warn(warning)
      }
    }
  },
  css: {
    devSourcemap: true
  },
  define: {
    "process.env": {}
  }
})
