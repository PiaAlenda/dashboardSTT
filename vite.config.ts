import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    port: 5176,
    proxy: {
      '/apicidi': {
        target: 'http://10.2.149.51:8000',
        changeOrigin: true,
      },
      '/apiuccuyo': {
        target: 'https://guarani.uccuyo.edu.ar',
        changeOrigin: true,
      }
    }
  },
})
