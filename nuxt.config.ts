import { createResolver } from 'nuxt/kit'

const { resolve } = createResolver(import.meta.url)

export default defineNuxtConfig({
  modules: [
    '@nuxt/ui'
  ],
  colorMode: {
    preference: 'dark' // dark / light
  },
  runtimeConfig: {
    dbDir: resolve('./server/db'),
  },
  nitro: {
    moduleSideEffects: ['lucia/polyfill/node']
  }
})
