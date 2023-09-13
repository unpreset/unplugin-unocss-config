import {
  defineConfig,
  transformerCompileClass,
  transformerDirectives,
  transformerVariantGroup,
} from 'unocss'
import { presetUseful } from 'unocss-preset-useful'

export default defineConfig({
  theme: {
    fontFamily: {
      sans: '\'Inter\', sans-serif',
      mono: '\'Fira Code\', monospace',
    },
  },
  presets: [
    presetUseful({
      typography: true,
      icons: {
        extraProperties: {
          'display': 'inline-block',
          'vertical-align': 'middle',
        },
      },
      remToPx: true,
    }),
  ],
  transformers: [
    transformerCompileClass(),
    transformerVariantGroup(),
    transformerDirectives(),
  ],
})
