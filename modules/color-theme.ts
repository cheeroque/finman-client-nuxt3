import { createResolver, defineNuxtModule } from '@nuxt/kit'
import chromaJs from 'chroma-js'

type ThemeColorName = 'primary' | 'secondary' | 'tertiary' | 'neutral' | 'neutral-variant' | 'danger' | 'success'
type ThemePrefix = 'on' | undefined
type ThemeSuffix = 'active' | 'bg' | 'bg-active' | 'outline' | 'surface' | undefined

interface ThemeColor {
  c?: string
  h?: string
  name: ThemeColorName
}

interface ThemeItem {
  prefix?: ThemePrefix
  stop: number
  strength?: number
  suffix?: ThemeSuffix
}

type ModuleOptions = Partial<Record<ThemeColorName, string | undefined>>

const fs = require('fs')

const THEME_DARK: ThemeItem[] = [
  { suffix: undefined, stop: 80 },
  { suffix: 'active', stop: 87 },
  { suffix: 'outline', stop: 80, strength: 0.25 },
  { prefix: 'on', stop: 20 },
  { suffix: 'bg', stop: 30 },
  { suffix: 'bg-active', stop: 35 },
  { prefix: 'on', suffix: 'bg', stop: 90 },
  { prefix: 'on', suffix: 'bg-active', stop: 95 },
  { suffix: 'surface', stop: 10 },
  { prefix: 'on', suffix: 'surface', stop: 90 },
]

const THEME_LIGHT: ThemeItem[] = [
  { suffix: undefined, stop: 40 },
  { suffix: 'active', stop: 35 },
  { suffix: 'outline', stop: 40, strength: 0.175 },
  { prefix: 'on', stop: 99 },
  { suffix: 'bg', stop: 90 },
  { suffix: 'bg-active', stop: 85 },
  { prefix: 'on', suffix: 'bg', stop: 10 },
  { prefix: 'on', suffix: 'bg-active', stop: 5 },
  { suffix: 'surface', stop: 95 },
  { prefix: 'on', suffix: 'surface', stop: 10 },
]

const THEME_COLORS: ThemeColor[] = [
  { name: 'primary' },
  { name: 'secondary', h: '-40' },
  { name: 'tertiary', h: '+95' },
  { name: 'neutral', c: '3' },
  { name: 'neutral-variant', c: '3', h: '-40' },
  { name: 'danger', h: '35' },
  { name: 'success', h: '140' },
]

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: 'finman-color-theme',
    configKey: 'colorTheme',
    compatibility: {
      nuxt: '^3.0.0',
    },
  },

  defaults: {
    primary: '#6750a4',
  },

  setup(options, nuxt) {
    generateThemes(options)

    nuxt.options.css.push('~/assets/styles/theme.css')

    generateManifest(options)

    if (!Array.isArray(nuxt.options.app.head.link)) {
      nuxt.options.app.head.link = []
    }

    nuxt.options.app.head.link.push({
      rel: 'manifest',
      hid: 'manifest',
      href: '/manifest.json',
      crossorigin: 'use-credentials',
    })
  },
})

/* Adjust chroma & hue of given color and return hex value */

function adjustColor(base: string, chroma?: string, hue?: string) {
  let color = chromaJs(base)

  if (chroma) color = color.set('lch.c', chroma)
  if (hue) color = color.set('lch.h', hue)

  return color.hex()
}

/* Generate themed icons and PWA manifest file */

function generateManifest(options: ModuleOptions) {
  const { resolve } = createResolver(import.meta.url)

  const primaryColor = options.primary ?? ''

  /* Get SVG icon templates & set main color */

  let icon: string = fs.readFileSync(resolve('../public/icon-template.svg'), { encoding: 'utf8' })
  icon = icon.replaceAll('%THEME_COLOR%', primaryColor)

  let iconMaskable: string = fs.readFileSync(resolve('../public/icon-maskable-template.svg'), { encoding: 'utf8' })
  iconMaskable = iconMaskable.replaceAll('%THEME_COLOR%', primaryColor)

  /* Write SVG icon files */

  fs.writeFileSync(resolve('../public/icon.svg'), icon)
  fs.writeFileSync(resolve('../public/icon-maskable.svg'), iconMaskable)

  /* Build manifest */

  const manifest = {
    name: 'Finance Manager 3',
    short_name: 'Finman 3',
    icons: [
      {
        src: '/icon.svg',
        sizes: 'any',
        type: 'image/svg+xml',
        purpose: 'any',
      },
      {
        src: '/icon-maskable.svg',
        sizes: 'any',
        type: 'image/svg+xml',
        purpose: 'maskable',
      },
      {
        /* Chrome installable PWA icon */
        src: '/icon-maskable.svg',
        sizes: '384x384',
        type: 'image/svg+xml',
        purpose: 'any',
      },
    ],
    display: 'standalone',
    background_color: primaryColor,
    theme_color: primaryColor,
    lang: 'en',
    start_url: '/',
  }

  /* Save manifest to file */

  fs.writeFileSync(resolve('../public/manifest.json'), JSON.stringify(manifest))
}

/* Generate color themes and write them to the file */

function generateThemes(options: ModuleOptions) {
  const primaryColor = options.primary ?? ''

  const colorVarsDark = THEME_COLORS.map(({ name, c, h }) => {
    const color = options[name] ?? adjustColor(primaryColor, c, h)

    return getThemeShades(color, name, THEME_DARK, '#000').join('\n')
  }).join('\n')

  const colorVarsLight = THEME_COLORS.map(({ name, c, h }) => {
    const color = options[name] ?? adjustColor(primaryColor, c, h)

    return getThemeShades(color, name, THEME_LIGHT).join('\n')
  }).join('\n')

  const lines = [
    'html, :root.theme-light {',
    colorVarsLight,
    '}',
    '@media (prefers-color-scheme: light) { :root {',
    colorVarsLight,
    '}}',
    'html, :root.theme-dark {',
    colorVarsDark,
    '}',
    '@media (prefers-color-scheme: dark) { :root {',
    colorVarsDark,
    '}}',
  ]

  fs.writeFileSync('./assets/styles/theme.css', lines.join('\n'))
}

/* Generate CSS variables with shades for base theme color */

function getThemeShades(color: string, name: string, theme: ThemeItem[], blendBase: string = '#fff'): string[] {
  const scale = chromaJs.scale(['#000', color, '#fff']).domain([0, 40, 100]).mode('lch')

  return theme.map(({ prefix, stop, strength, suffix }) => {
    let color = scale(stop)

    /* Adjust saturation for colors darker than 30 and lighter than 50 */

    let saturationRatio = 1 + (40 - stop) / 100
    if (stop > 30 && stop < 50) saturationRatio = 0

    color = color.saturate(saturationRatio)

    if (strength) {
      color = chromaJs.mix(blendBase, color, strength, 'lch')
    }

    /* Get CSS variable name from non-empty parts */

    const varName = [prefix, name, suffix].filter((el) => Boolean(el?.length)).join('-')

    return `--${varName}: ${color.hex()};`
  })
}
