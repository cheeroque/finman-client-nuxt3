import graphql from '@rollup/plugin-graphql'

import { handleNuxtReady } from './hooks/ready'

/* https://nuxt.com/docs/api/configuration/nuxt-config */

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
          type: 'image/svg',
          href: '/icon.svg',
        },
        {
          rel: 'apple-touch-icon',
          hid: 'apple-touch-icon',
          type: 'image/svg',
          href: '/icon.svg',
        },
      ],
    },
  },

  modules: ['@pinia/nuxt', '@vueuse/nuxt', 'nuxt-icons'],

  css: ['~/assets/styles/app.scss'],

  hooks: {
    ready: (nuxt) => handleNuxtReady(nuxt),
  },

  runtimeConfig: {
    themePrimaryColor: '#6750a4',

    public: {
      gqlEndpoint: '',
      staticUrl: '',
    },
  },

  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `
            @use "sass:math";
            @use "sass:color";
            @import "~/assets/styles/_variables.scss";
            @import "~/assets/styles/_mixins.scss";
            @import "~/assets/styles/_utilities.scss";
          `,
        },
      },
    },

    plugins: [graphql()],
  },
})
