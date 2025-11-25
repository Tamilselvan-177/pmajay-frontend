import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      // '/api': {
      //   target: 'https://6d730a734f5c.ngrok-free.app',
      //   changeOrigin: true,
      //   secure: false,
     // },
    },
  },
});
