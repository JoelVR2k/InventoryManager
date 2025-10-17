import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    // This path is correct for your file structure.
    // By replacing the file, we eliminate any chance of a typo.
    setupFiles: './src/setupTests.js',
  },
}) 