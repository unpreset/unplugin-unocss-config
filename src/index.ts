import { resolve } from 'path'
import fs from 'fs'
import { createUnplugin } from 'unplugin'
import { createGenerator } from '@unocss/core'
import { loadConfig } from '@unocss/config'
import { isPackageExists } from 'local-pkg'
// import fs from 'fs-extra'
import Debug from 'debug'
import type { Options } from './types'

const log = Debug('unplugin:unocss-config')

export default createUnplugin<Options | undefined>((options) => {
  options = options || {
    dts: isPackageExists('typescript'),
  }
  return {
    name: 'unplugin-unocss-config',
    enforce: 'pre',
    vite: {
      async config(config) {
        log('generateDts dts', '-----------------------')
        const result = await loadConfig(config.root, options?.path)
        const uno = createGenerator(result.config)
        return {
          define: {
            'import.meta.env.__UNO__': uno,
            'import.meta.env.__UNO_CONFIG__': uno.config,
            'import.meta.env.__UNO_THEME__': uno.config.theme,
          },
        }
      },
      async configResolved(config) {
        const dts = resovleDtsPath(config.root, options?.dts)

        log('generateDts dts', dts)
        // if (!dts)
        //   return

        // generateDts(dts)
      },
    },
  }
})

function resovleDtsPath(root: string, dts?: string | boolean) {
  return !dts
    ? false
    : resolve(
      root,
      typeof dts === 'string'
        ? dts
        : 'vite-env.d.ts',
    )
}

function generateDts(path: string) {
  let content = ''
  if (fs.existsSync(path)) {
    content = fs.readFileSync(path, { encoding: 'utf-8' })
    const key = 'interface ImportMetaEnv {'
    const index = content.lastIndexOf(key)
    const template = `
    /* UNO */
    readonly __UNO__: ReturnType<typeof import('@unocss/core').createGenerator>
    readonly __UNO_CONFIG__: import('@unocss/core').UserConfig
    readonly __UNO_THEME__: import('@unocss/preset-mini').Theme
  `
    if (index > -1) {
      content = `${content.slice(0, index + key.length)}
      ${template}
      ${content.slice(index + key.length)}`
    }

    log('generateDts Content', path)

    fs.writeFileSync(path, content, { encoding: 'utf-8' })
  }
}

