import path from "path"
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
    dedupe: ['three', 'react', 'react-dom', '@react-three/fiber', '@react-three/drei'],
  },
  build: {
    sourcemap: false,
    target: 'esnext',
    cssCodeSplit: true,
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          'vendor-three': ['three', '@react-three/fiber', '@react-three/drei'],
          'vendor-anim': ['framer-motion', 'gsap', '@gsap/react'],
          'vendor-utils': ['lucide-react', 'clsx', 'tailwind-merge', 'axios', 'lenis'],
        }
      }
    },
    chunkSizeWarningLimit: 1000,
  },
})
