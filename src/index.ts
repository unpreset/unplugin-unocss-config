import { createGenerator } from '@unocss/core'
import { loadConfig } from '@unocss/config'
import { type UnpluginFactory, createUnplugin } from 'unplugin'
import type { Options } from './types'

export const unpluginFactory: UnpluginFactory<Options | undefined> = (options) => {
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
      configureServer(server) {
        server.watcher.on('change', async (path) => {
          if (path.includes('uno.config.')) {
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
}

export const unplugin = /* #__PURE__ */ createUnplugin(unpluginFactory)

export default unplugin
