import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'], // Tách chunk cho các thư viện lớn
        },
      },
    },
    chunkSizeWarningLimit: 1000, // Tăng giới hạn cảnh báo
  },
})
