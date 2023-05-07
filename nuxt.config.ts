import { handleNuxtReady } from './hooks/ready'

// For building on vercel: https://github.com/Automattic/node-canvas/issues/1779
if (
  process.env.LD_LIBRARY_PATH == null ||
  !process.env.LD_LIBRARY_PATH.includes(`${process.env.PWD}/node_modules/canvas/build/Release:`)
) {
  process.env.LD_LIBRARY_PATH = `${process.env.PWD}/node_modules/canvas/build/Release:${
    process.env.LD_LIBRARY_PATH || ''
  }`
}

// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({
  ssr: false,
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

  modules: ['@nuxtjs/apollo', '@pinia/nuxt', 'nuxt-icons'],

  apollo: {
    clients: {
      default: {
        httpEndpoint: process.env.GQL_HOST,
        httpLinkOptions: {
          credentials: 'include',
          fetchOptions: {
            credentials: 'include',
          },
        },
      },
    },
    cookieAttributes: {
      httpOnly: false,
      sameSite: 'Strict',
      secure: true,
    },
  },

  css: ['~/assets/styles/app.scss'],

  hooks: {
    ready: (nuxt) => handleNuxtReady(nuxt),
  },

  runtimeConfig: {
    API_URL: process.env.API_URL,
    STATIC_URL: process.env.STATIC_URL,
    THEME_PRIMARY_COLOR: process.env.THEME_PRIMARY_COLOR || '#6750a4',
    TOKEN_COOKIE_NAME: process.env.TOKEN_COOKIE_NAME || 'auth_token',

    public: {
      API_URL: process.env.API_URL,
      STATIC_URL: process.env.STATIC_URL,
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
  },

  /* prevent unstyled content flashing on reload */
  experimental: {
    inlineSSRStyles: false,
  },
})
