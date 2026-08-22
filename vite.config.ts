import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/tongue-and-cheek/',
  css: { devSourcemap: true },
  test: {
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
  },
})
