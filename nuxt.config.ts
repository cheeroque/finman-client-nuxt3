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

  modules: ['@vueuse/nuxt', 'nuxt-icons', '~/modules/color-theme'],

  css: ['~/assets/styles/app.scss'],

  colorTheme: {
    primary: process.env.THEME_PRIMARY_COLOR,
    secondary: process.env.THEME_SECONDARY_COLOR,
    tertiary: process.env.THEME_TERTIARY_COLOR,
    neutral: process.env.THEME_NEUTRAL_COLOR,
    'neutral-variant': process.env.THEME_NEUTRAL_VARIANT_COLOR,
    danger: process.env.THEME_DANGER_COLOR,
    success: process.env.THEME_SUCCESS_COLOR,
  },

  runtimeConfig: {
    gqlEndpoint: '',

    public: {
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
  },
})
