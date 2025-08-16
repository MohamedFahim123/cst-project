import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    // Make sure your output folder is correct; typically it's 'dist' by default
    outDir: 'dist',
  },
  server: {
    // Ensures Vite server uses HTML5 history mode for routing
    historyApiFallback: true,
  }
})
