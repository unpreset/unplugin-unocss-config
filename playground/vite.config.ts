import { defineConfig } from 'vite'
import Inspect from 'vite-plugin-inspect'
import vue from '@vitejs/plugin-vue'
import UnoCSS from '@unocss/vite'
import Unplugin from '../src/vite'

export default defineConfig({
  plugins: [
    vue(),
    UnoCSS(),
    Inspect(),
    Unplugin({ dts: true }),
  ],
})
