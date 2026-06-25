import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'fs'

export default defineConfig({
  plugins: [react()],
  server: {
    https: {
      key: fs.readFileSync('../backend/localhost+1-key.pem'),
      cert: fs.readFileSync('../backend/localhost+1.pem'),
    },
        proxy: {
      '/auth/google': {
        target: 'https://localhost:8000',
        secure: false,
      },
      '/auth': {
        target: 'https://localhost:8000',
        secure: false,
      },
      '/api': {
        target: 'https://localhost:8000',
        secure: false,
      },
      '/upload': {
        target: 'https://localhost:8000',
        secure: false,
      },
      '/results': {
        target: 'https://localhost:8000',
        secure: false,
      },
      '/cases': {
        target: 'https://localhost:8000',
        secure: false,
      },
      '/reports': {
        target: 'https://localhost:8000',
        secure: false,
      },
      '/notifications': {
        target: 'https://localhost:8000',
        secure: false,
      },
      '/audit': {
        target: 'https://localhost:8000',
        secure: false,
      },
      '/hexviewer': {
        target: 'https://localhost:8000',
        secure: false,
      },
      '/google-callback': {
        target: 'https://localhost:8000',
        secure: false,
      },
    }
  }
})