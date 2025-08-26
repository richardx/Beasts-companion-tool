import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import { copyFileSync, mkdirSync, readdirSync } from 'fs'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
    {
      name: 'copy-images',
      closeBundle() {
        // Kopier beast_images til dist
        const source = './beast_images'
        const target = './dist/beast_images'
        mkdirSync(target, { recursive: true })
        readdirSync(source).forEach(file => {
          copyFileSync(`${source}/${file}`, `${target}/${file}`)
        })
      }
    }
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
})