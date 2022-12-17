// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({
  app: {
    head: {
      title: 'Finance Manager 3',
      htmlAttrs: {
        lang: 'ru',
      },
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { hid: 'description', name: 'description', content: '' },
        {
          hid: 'mobile-web-app-capable',
          name: 'mobile-web-app-capable',
          content: 'yes',
        },
      ],
      link: [
        {
          rel: 'shortcut icon',
          hid: 'shortcut-icon',
          type: 'image/png',
          href: '/icon-32.png',
        },
        {
          rel: 'apple-touch-icon',
          hid: 'apple-touch-icon',
          type: 'image/png',
          href: '/icon.png',
        },
        {
          rel: 'manifest',
          hid: 'manifest',
          href: '/manifest.json',
          crossorigin: 'use-credentials',
        },
      ],
    },
  },

  modules: ['@pinia/nuxt', '@sidebase/nuxt-auth', 'nuxt-icons'],

  css: ['@/assets/styles/app.scss'],

  runtimeConfig: {
    NUXT_SECRET: process.env.NUXT_SECRET,
    API_URL: process.env.API_URL,

    public: {
      apiUrl: process.env.API_URL,
      staticUrl: process.env.STATIC_URL,
    },
  },

  auth: {
    basePath: '/api/auth',
    enableGlobalAppMiddleware: true,
    origin: process.env.ORIGIN,
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

  /* prevent unstyled content flashing on reload */
  experimental: {
    inlineSSRStyles: false,
  },
})
