import { createResolver } from 'nuxt/kit'

const { resolve } = createResolver(import.meta.url)

export default defineNuxtConfig({
  modules: [
    '@nuxt/ui',
    '@pinia/nuxt',
    '@pinia-plugin-persistedstate/nuxt',
  ],
  colorMode: {
    preference: 'dark', // dark / light
  },
  runtimeConfig: {
    dbDir: resolve('./server/db'),
    githubClientId: '',
    githubClientSecret: '',
  },
  nitro: {
    moduleSideEffects: ['lucia/polyfill/node'],
  },
  ui: {
    icons: ['mdi'],
  },
})
