import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

// https://vite.dev/config/
export default defineConfig({
  base: './',
  plugins: [react()],
  server: {
    watch: {
      ignored: ['**/Google app/**', '**/*.crdownload', '**/node_modules/**']
    }
  },
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        details: resolve(__dirname, 'details.html'),
        dashboard: resolve(__dirname, 'dashboard.html'),
        report: resolve(__dirname, 'report.html')
      }
    }
  }
})

