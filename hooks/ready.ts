import chroma from 'chroma-js'
import type { Nuxt } from '@nuxt/schema'
import type { Color } from 'chroma-js'

type ThemeColor = {
  c?: string
  h?: string
  name: string
}

type ThemeItem = {
  prefix?: string
  stop: number
  strength?: number
  suffix?: string
}

export const handleNuxtReady = (nuxt: Nuxt) => {
  const fs = require('fs')
  const config = nuxt.options.runtimeConfig

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
    { name: 'neutral', c: '2' },
    { name: 'neutral-variant', c: '2', h: '-40' },
    { name: 'danger', h: '35' },
    { name: 'success', h: '140' },
  ]

  const primaryColor = config.THEME_PRIMARY_COLOR

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

function adjustColor(base: string, c?: string, h?: string): string {
  let color: Color = chroma(base)
  if (c) color = color.set('lch.c', c)
  if (h) color = color.set('lch.h', h)
  return color.hex()
}

function getThemeShades(color: string, name: string, theme: ThemeItem[], blendBase: string = '#fff'): string[] {
  const scale = chroma.scale(['#000', color, '#fff']).domain([0, 40, 100]).mode('lch')
  return theme.map(({ prefix, stop, strength, suffix }) => {
    const saturationRatio = stop >= 40 ? ((stop - 40) * 1.5) / 100 : 0
    let color: Color = scale(stop)
    if (saturationRatio) color = color.saturate(saturationRatio)
    if (strength) color = chroma.mix(blendBase, color, strength, 'lch')

    const varName = [prefix, name, suffix].filter((el) => Boolean(el?.length)).join('-')
    return `--${varName}: ${color.hex()};`
  })
}
