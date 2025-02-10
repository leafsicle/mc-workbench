import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import path from "path"

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
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
  server: {
    port: 3001,
    historyApiFallback: true
  },
  base: "https://mattcooke.tech/",
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src")
    }
  },
  build: {
    rollupOptions: {
      onwarn(warning, warn) {
        if (warning.code === "MODULE_LEVEL_DIRECTIVE") return
        warn(warning)
      }
    }
  },
  define: {
    "process.env": {}
  }
})
