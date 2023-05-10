import chroma from 'chroma-js'
import type { Nuxt } from '@nuxt/schema'
import type { Color } from 'chroma-js'

interface ThemeColor {
  c?: string
  h?: string
  name: string
}

interface ThemeItem {
  prefix?: string
  stop: number
  strength?: number
  suffix?: string
}

const fs = require('fs')

export const handleNuxtReady = (nuxt: Nuxt) => {
  generateManifest(nuxt)
  generateThemes(nuxt)
}

function adjustColor(base: string, c?: string, h?: string): string {
  let color: Color = chroma(base)
  if (c) color = color.set('lch.c', c)
  if (h) color = color.set('lch.h', h)
  return color.hex()
}

function generateManifest(nuxt: Nuxt) {
  const config = nuxt.options.runtimeConfig
  const primaryColor = config.THEME_PRIMARY_COLOR

  /** Get SVG icon templates & set main color */
  let icon: string = fs.readFileSync('./public/icon-template.svg', { encoding: 'utf8' })
  icon = icon.replaceAll('%THEME_COLOR%', primaryColor)

  let iconMaskable: string = fs.readFileSync('./public/icon-maskable-template.svg', { encoding: 'utf8' })
  iconMaskable = iconMaskable.replaceAll('%THEME_COLOR%', primaryColor)

  /** Write SVG icon files */
  fs.writeFileSync('./public/icon.svg', icon)
  fs.writeFileSync('./public/icon-maskable.svg', iconMaskable)

  /** Build manifest */
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

  /** Save manifest to file & add it to options */
  fs.writeFileSync('./public/manifest.json', JSON.stringify(manifest))

  nuxt.options.app.head.link?.push({
    rel: 'manifest',
    hid: 'manifest',
    href: '/manifest.json',
    crossorigin: 'use-credentials',
  })
}

function generateThemes(nuxt: Nuxt) {
  const config = nuxt.options.runtimeConfig
  const primaryColor = config.THEME_PRIMARY_COLOR

  const themeDark: ThemeItem[] = [
    { suffix: '', stop: 80 },
    { suffix: 'active', stop: 87 },
    { suffix: 'outline', stop: 80, strength: 0.25 },
    { prefix: 'on', stop: 20 },
    { suffix: 'bg', stop: 30 },
    { prefix: 'on', suffix: 'bg', stop: 90 },
    { suffix: 'surface', stop: 10 },
    { prefix: 'on', suffix: 'surface', stop: 90 },
  ]

  const themeLight: ThemeItem[] = [
    { suffix: '', stop: 40 },
    { suffix: 'active', stop: 35 },
    { suffix: 'outline', stop: 40, strength: 0.175 },
    { prefix: 'on', stop: 99 },
    { suffix: 'bg', stop: 90 },
    { prefix: 'on', suffix: 'bg', stop: 10 },
    { suffix: 'surface', stop: 95 },
    { prefix: 'on', suffix: 'surface', stop: 10 },
  ]

  const themeColors: ThemeColor[] = [
    { name: 'primary' },
    { name: 'secondary', h: '-40' },
    { name: 'tertiary', h: '+95' },
    { name: 'neutral', c: '3' },
    { name: 'neutral-variant', c: '3', h: '-40' },
    { name: 'danger', h: '35' },
    { name: 'success', h: '140' },
  ]

  const colorVarsDark = themeColors
    .map(({ name, c, h }) => {
      const configName: string = `THEME_${name.toUpperCase().replaceAll('-', '_')}_COLOR`
      const color: string = config[configName] || adjustColor(primaryColor, c, h)

      return getThemeShades(color, name, themeDark, '#000').join('\n')
    })
    .join('\n')

  const colorVarsLight = themeColors
    .map(({ name, c, h }) => {
      const configName: string = `THEME_${name.toUpperCase().replaceAll('-', '_')}_COLOR`
      const color: string = config[configName] || adjustColor(primaryColor, c, h)

      return getThemeShades(color, name, themeLight).join('\n')
    })
    .join('\n')

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

  nuxt.options.css.push('~/assets/styles/theme.css')
}

function getThemeShades(color: string, name: string, theme: ThemeItem[], blendBase: string = '#fff'): string[] {
  const scale = chroma.scale(['#000', color, '#fff']).domain([0, 40, 100]).mode('lch')

  return theme.map(({ prefix, stop, strength, suffix }) => {
    let color: Color = scale(stop)

    /** Adjust saturation for colors darker than 30 and lighter than 50 */
    let saturationRatio = 1 + (40 - stop) / 100
    if (stop > 30 && stop < 50) saturationRatio = 0

    color = color.saturate(saturationRatio)

    if (strength) color = chroma.mix(blendBase, color, strength, 'lch')

    const varName = [prefix, name, suffix].filter((el) => Boolean(el?.length)).join('-')

    return `--${varName}: ${color.hex()};`
  })
}
