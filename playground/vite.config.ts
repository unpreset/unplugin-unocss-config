import { defineConfig } from 'vite'
import Inspect from 'vite-plugin-inspect'
import vue from '@vitejs/plugin-vue'
import UnoCSS from 'unocss/vite'
import Unplugin from 'unplugin-unocss-config/vite'

export default defineConfig({
  plugins: [
    vue(),
    UnoCSS(),
    Inspect(),
    Unplugin(),
  ],
})
