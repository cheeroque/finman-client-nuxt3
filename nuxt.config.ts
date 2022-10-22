import { defineNuxtConfig } from 'nuxt'

// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({
  buildModules: ['@pinia/nuxt', 'nuxt-icons'],

  css: ['@/assets/styles/app.scss'],

  runtimeConfig: {
    public: {
      apiUrl: process.env.API_URL,
      staticUrl: process.env.STATIC_URL,
    },
  },

  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          additionalData:
            '@use "sass:math"; @use "sass:color"; @import "@/assets/styles/_variables.scss"; @import "@/assets/styles/_mixins.scss"; @import "@/assets/styles/_utilities.scss";',
        },
      },
    },
  },
})
