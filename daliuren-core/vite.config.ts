import { defineConfig } from 'vite'
import { resolve } from 'path'

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'DaLiuRenCore',
      fileName: (format) => `index.${format}.js`
    },
    rollupOptions: {
      external: ['lunar-javascript', 'solarlunar'],
      output: {
        globals: {
          'lunar-javascript': 'Lunar',
          'solarlunar': 'solarLunar'
        }
      }
    }
  }
})
