import { createResolver, defineNuxtModule } from '@nuxt/kit'
import { writeFile } from 'node:fs/promises'
import { defaults } from './defaults'
import { getGrid } from './grid'
import { getColors, getIcons, getManifest } from './theme'
import { getUtilities } from './utilities'
import type { UiModuleOptions } from './types'

export default defineNuxtModule<UiModuleOptions>({
  meta: {
    name: 'finman-ui',
    configKey: 'ui',
    compatibility: {
      nuxt: '^3.0.0',
    },
  },

  defaults,

  async setup(options, nuxt) {
    const { resolve } = createResolver(import.meta.url)

    const cssPath = resolve('./runtime/index.css')
    const cssContents = [getGrid(options), getUtilities(options), getColors(options)].join('\n\n')

    const { icon, iconMaskable } = await getIcons(options)

    const manifest = getManifest(options)

    await Promise.all([
      writeFile(cssPath, cssContents),
      writeFile(resolve('../../public/icon.svg'), icon),
      writeFile(resolve('../../public/icon-maskable.svg'), iconMaskable),
      writeFile(resolve('../../public/manifest.json'), JSON.stringify(manifest)),
    ])

    nuxt.options.css.push(cssPath)

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
