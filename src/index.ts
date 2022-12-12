import { resolve } from 'path'
import fs from 'fs'
import { createUnplugin } from 'unplugin'
import { createGenerator } from '@unocss/core'
import { loadConfig } from '@unocss/config'
import { isPackageExists } from 'local-pkg'
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
        const dts = resovleDtsPath(config.root, options!.dts)

        if (!dts)
          return

        generateDts(dts)
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

function prepareContent(content: string) {
  const match = content.match(/(interface ImportMeta \{)[\r\n\s\w:.]*(readonly env: ImportMetaEnv)?/)
  if (match != null) {
    if (!match[1]) {
      content += `\n
interface ImportMeta {
  readonly env: ImportMetaEnv
}`.trim()
    }
    else if (!match[2]) {
      content
      = `${content.slice(0, match.index! + match[1].length)
         }\n  readonly env: ImportMetaEnv${
        content.slice(match.index! + match[1].length)}`
    }
  }

  return content
}

function generateDts(path: string) {
  let content = ''
  if (fs.existsSync(path)) {
    content = prepareContent(fs.readFileSync(path, { encoding: 'utf-8' }))

    log('generateDts match', content)

    //     const key = 'interface ImportMetaEnv {'
    //     const index = content.lastIndexOf(key)
    //     log('generateDts index', index)
    //     const template = `
    //   /* Generated by 'unplugin-unocss-config' */
    //   readonly __UNO__: Pick<ReturnType<typeof import('unocss').createGenerator>, 'config' | 'userConfig' | 'version'>
    //   readonly __UNO_CONFIG__: import('unocss').UserConfig
    //   readonly __UNO_THEME__: import('unocss').UserConfig['theme']
    // `
    //     if (index > -1) {
    //       content = `${content.slice(0, index + key.length)}${template}${content.slice(index + key.length)}`
    //     }
    //     else {
    //       content += `\n
    // interface ImportMetaEnv {${template}}
    // `
    //     }

    //     log('generateDts Content', path)

    //     fs.writeFileSync(path, content, { encoding: 'utf-8' })
  }
}

