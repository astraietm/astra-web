import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    sourcemap: false,
    target: 'esnext',
  },
  resolve: {
    alias: {
      '@react-spring/three': '@react-spring/three/dist/react-spring-three.esm.js',
      '@react-spring/web': '@react-spring/web/dist/react-spring-web.esm.js'
    }
  },
})
