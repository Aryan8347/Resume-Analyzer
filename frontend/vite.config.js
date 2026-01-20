import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/Resume-Analyzer/' // EXACT repo name
})

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
})
