import { createUnplugin } from 'unplugin'
import { createGenerator } from '@unocss/core'
import { loadConfig } from '@unocss/config'
import type { ViteDevServer } from 'vite'
import type { Options } from './types'

export default createUnplugin<Options | undefined>((options) => {
  let uno: ReturnType<typeof createGenerator>

  return {
    name: 'unplugin-unocss-config',
    enforce: 'pre',
    vite: {
      async config(config) {
        const result = loadConfig(config.root, options?.path)
        uno = createGenerator((await result).config)

        return {
          define: {
            'import.meta.env.__UNO__': uno,
            'import.meta.env.__UNO_CONFIG__': uno.config,
            'import.meta.env.__UNO_THEME__': uno.config.theme,
            '__UNO__': uno,
            '__UNO_CONFIG__': uno.config,
            '__UNO_THEME__': uno.config.theme,
          },
        }
      },
      configureServer(server: ViteDevServer) {
        // 监听 uno.config.js 文件变化
        server.watcher.on('change', async (path) => {
          if (path.endsWith('uno.config.ts')) {
            uno = createGenerator((await loadConfig(server.config.root, options?.path)).config)
            server.ws.send({
              type: 'custom',
              event: 'uno-config-update',
              data: uno,
            })
          }
        })
      },
    },
  }
})
