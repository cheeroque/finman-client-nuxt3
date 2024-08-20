import { createResolver, defineNuxtModule } from '@nuxt/kit'
import fs from 'fs'
import { defaults } from './defaults'
import { getGrid } from './grid'
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

  setup(options, nuxt) {
    const { resolve } = createResolver(import.meta.url)

    const filePath = resolve('./runtime/index.css')
    const fileContents = () => [getGrid(options), getUtilities(options)].join('\n\n')

    fs.writeFileSync(filePath, fileContents())

    nuxt.options.css.push(filePath)
  },
})
