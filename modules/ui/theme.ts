import { createResolver } from '@nuxt/kit'
import chromaJs from 'chroma-js'
import { readFile } from 'node:fs/promises'
import type { UiModuleOptions } from './types'

type UiThemeColorDefinition = {
  prefix?: 'on'
  stop: number
  strength?: number
  suffix?: 'active' | 'bg' | 'bg-active' | 'outline' | 'surface'
}

type UiTheme = {
  dark: UiThemeColorDefinition[]
  light: UiThemeColorDefinition[]
}

const THEME: UiTheme = {
  dark: [
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
  ],
  light: [
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
  ],
}

const THEME_BLEND_BASE = {
  dark: '#000000',
  light: '#ffffff',
}

/* Generate app icon files from templates */
export async function getIcons(options: UiModuleOptions) {
  const color = options.theme.colors.primary ?? '#000000'
  const { resolve } = createResolver(import.meta.url)

  let [icon, iconMaskable] = await Promise.all([
    readFile(resolve('../../public/icon-template.svg'), { encoding: 'utf8' }),
    readFile(resolve('../../public/icon-maskable-template.svg'), { encoding: 'utf8' }),
  ])

  icon = icon.replaceAll('%THEME_COLOR%', color)
  iconMaskable = iconMaskable.replaceAll('%THEME_COLOR%', color)

  return { icon, iconMaskable }
}

/* Generate CSS custom properties with color palettes for light and dark mode */
export function getColors(options: UiModuleOptions) {
  const cssVariablesDark: string[] = []
  const cssVariablesLight: string[] = []

  Object.entries(options.theme.colors).forEach(([name, hex]) => {
    cssVariablesDark.push(...getShades(name, hex, 'dark'))
    cssVariablesLight.push(...getShades(name, hex, 'light'))
  })

  const lines = [
    'html.theme-light, :root.theme-light {',
    cssVariablesLight.join('\n'),
    '}',
    '@media (prefers-color-scheme: light) { :root {',
    cssVariablesLight.join('\n'),
    '}}',
    'html.theme-dark, :root.theme-dark {',
    cssVariablesDark.join('\n'),
    '}',
    '@media (prefers-color-scheme: dark) { :root {',
    cssVariablesDark.join('\n'),
    '}}',
  ]

  return lines.join('\n')
}

/* Generate PWA manifest */
export function getManifest(options: UiModuleOptions) {
  return {
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
    background_color: options.theme.colors.primary,
    theme_color: options.theme.colors.primary,
    lang: 'en',
    start_url: '/',
  }
}

function getShades(name: string, hex: string, mode: 'dark' | 'light') {
  const scale = chromaJs.scale(['#000', hex, '#fff']).domain([0, 40, 100]).mode('lch')
  const theme = THEME[mode]
  const themeBlendBase = THEME_BLEND_BASE[mode]

  return theme.map(({ prefix, stop, strength, suffix }) => {
    let color = scale(stop)

    /* Adjust saturation for colors darker than 30 and lighter than 50 */

    let saturationRatio = 1 + (40 - stop) / 100
    if (stop > 30 && stop < 50) saturationRatio = 0

    color = color.saturate(saturationRatio)

    if (strength) {
      color = chromaJs.mix(themeBlendBase, color, strength, 'lch')
    }

    /* Get CSS variable name from non-empty parts */

    const varName = [prefix, name, suffix].filter((el) => Boolean(el?.length)).join('-')

    return `--${varName}: ${color.hex()};`
  })
}
