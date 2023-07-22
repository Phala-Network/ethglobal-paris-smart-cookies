import { defineConfig } from 'vite'
import { crx } from '@crxjs/vite-plugin'
import manifest from './manifest.config'

export default defineConfig({
  plugins: [crx({ manifest })],
  build: {
    target: ['es2020'],
    rollupOptions: {
      input: {
        options: 'src/pages/options.html',
      }
    }
  }
})

