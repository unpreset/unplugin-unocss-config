# unplugin-unocss-config

[![NPM version](https://img.shields.io/npm/v/unplugin-unocss-config?color=a1b858&label=)](https://www.npmjs.com/package/unplugin-unocss-config)

Load your uno config and use it in run-time.

## Usage

```html
<script lang='ts' setup>
console.log(__UNO__)
console.log(__UNO_CONFIG__)
console.log(__UNO_THEME__)

console.log(import.meta.env.__UNO__)
console.log(import.meta.env.__UNO_CONFIG__)
console.log(import.meta.env.__UNO_THEME__)

const presets = __UNO_CONFIG__.presets?.map((p: any) => p.name)
const transformers = import.meta.env.__UNO_CONFIG__.transformers?.map((t: any) => t.name)
</script>
```

## Install

```bash
pnpm add unplugin-unocss-config
```

<details>
<summary>Vite</summary><br>

```ts
// vite.config.ts
import UnoCSSConfig from 'unplugin-unocss-config/vite'

export default defineConfig({
  plugins: [
    UnoCSSConfig(),
  ],
})
```

### Type
```ts
// vite-env.d.ts
/// <reference types="unplugin-unocss-config/client" />
```

Example: [`playground/`](./playground/)

</details>

<details>
<summary>Nuxt</summary><br>

```ts
// nuxt.config.js
export default {
  buildModules: [
    ['unplugin-unocss-config/nuxt', { /* options */ }],
  ],
}
```

> This module works for both Nuxt 2 and [Nuxt Vite](https://github.com/nuxt/vite)

<br></details>

## License

MIT License &copy; 2023-PRESENT [Chris](https://github.com/zyyv)
