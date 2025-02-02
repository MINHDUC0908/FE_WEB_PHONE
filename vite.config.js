import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: process.env.PORT || 3000, // Render sẽ cung cấp cổng thông qua biến môi trường PORT
  },
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
