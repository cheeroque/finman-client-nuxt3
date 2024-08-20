import { createResolver, defineNuxtModule } from '@nuxt/kit'
import fs from 'fs'

type GridBreakpoint = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl'
type PropertyValue = number | string | null

type UtilityDefinition = {
  property: string | string[]
  responsive?: boolean
  values: (PropertyValue | Record<string, PropertyValue>)[]
}

type UiModuleOptions = {
  grid: {
    breakpoints: Partial<Record<GridBreakpoint, PropertyValue>> & Record<string, PropertyValue>
    containerWidths: Partial<Record<GridBreakpoint, PropertyValue>> & Record<string, PropertyValue>
    gap: PropertyValue
  }
  utilities: Record<string, UtilityDefinition | false>
}

export default defineNuxtModule<UiModuleOptions>({
  meta: {
    name: 'finman-ui',
    configKey: 'ui',
    compatibility: {
      nuxt: '^3.0.0',
    },
  },

  defaults: {
    grid: {
      breakpoints: {
        xs: 0,
        sm: 576,
        md: 768,
        lg: 992,
        xl: 1200,
        xxl: 1400,
      },

      containerWidths: {
        xs: null,
        sm: 540,
        md: 720,
        lg: 960,
        xl: 1140,
        xxl: 1320,
      },

      gap: '1.5rem',
    },

    utilities: {
      d: {
        property: 'display',
        responsive: true,
        values: ['block', 'inline', 'inline-block', 'flex', 'inline-flex', 'grid', 'inline-grid', 'none'],
      },

      fs: {
        property: 'font-size',
        responsive: true,
        values: getRemSizes(),
      },

      fw: {
        property: 'font-weight',
        responsive: true,
        values: [{ light: 300, normal: 400, medium: 500, bold: 800 }],
      },

      gc: {
        property: 'column-gap',
        responsive: true,
        values: getRemSizes(),
      },

      gr: {
        property: 'row-gap',
        responsive: true,
        values: getRemSizes(),
      },

      h: {
        property: 'height',
        responsive: true,
        values: getPercentSizes(),
      },

      lh: {
        property: 'line-height',
        responsive: true,
        values: [{ base: 1.5, heading: 1.2, '100': 1, '120': 1.2, '140': 1.4 }],
      },

      mb: {
        property: 'margin-bottom',
        responsive: true,
        values: getRemSizes(true),
      },

      me: {
        property: 'margin-right',
        responsive: true,
        values: getRemSizes(true),
      },

      ms: {
        property: 'margin-left',
        responsive: true,
        values: getRemSizes(true),
      },

      mt: {
        property: 'margin-top',
        responsive: true,
        values: getRemSizes(true),
      },

      mx: {
        property: ['margin-left', 'margin-right'],
        responsive: true,
        values: getRemSizes(true),
      },

      my: {
        property: ['margin-bottom', 'margin-top'],
        responsive: true,
        values: getRemSizes(true),
      },

      of: {
        property: 'overflow',
        values: ['auto', 'hidden', 'scroll', 'visible'],
      },

      pb: {
        property: 'padding-bottom',
        responsive: true,
        values: getRemSizes(),
      },

      pe: {
        property: 'padding-right',
        responsive: true,
        values: getRemSizes(),
      },

      ps: {
        property: 'padding-left',
        responsive: true,
        values: getRemSizes(),
      },

      pt: {
        property: 'padding-top',
        responsive: true,
        values: getRemSizes(),
      },

      px: {
        property: ['padding-left', 'padding-right'],
        responsive: true,
        values: getRemSizes(),
      },

      py: {
        property: ['padding-bottom', 'padding-top'],
        responsive: true,
        values: getRemSizes(),
      },

      shadow: {
        property: 'box-shadow',
        values: [
          { 1: '0px 1px 3px rgba(0, 0, 0, 0.2), 0px 2px 2px rgba(0, 0, 0, 0.12), 0px 0px 2px rgba(0, 0, 0, 0.14)' },
          { 2: '0px 1px 5px rgba(0, 0, 0, 0.2), 0px 3px 4px rgba(0, 0, 0, 0.12), 0px 0px 4px rgba(0, 0, 0, 0.14)' },
          { 3: '0px 1px 8px rgba(0, 0, 0, 0.2), 0px 3px 4px rgba(0, 0, 0, 0.12), 0px 3px 3px rgba(0, 0, 0, 0.14)' },
          { 4: '0px 1px 10px rgba(0, 0, 0, 0.2), 0px 4px 5px rgba(0, 0, 0, 0.12), 0px 2px 4px rgba(0, 0, 0, 0.14)' },
          { 6: '0px 3px 5px rgba(0, 0, 0, 0.2), 0px 1px 18px rgba(0, 0, 0, 0.12), 0px 6px 10px rgba(0, 0, 0, 0.14)' },
          { 8: '0px 4px 15px rgba(0, 0, 0, 0.2), 0px 3px 14px rgba(0, 0, 0, 0.12), 0px 8px 10px rgba(0, 0, 0, 0.14)' },
          { 9: '0px 5px 6px rgba(0, 0, 0, 0.2), 0px 3px 16px rgba(0, 0, 0, 0.12), 0px 9px 12px rgba(0, 0, 0, 0.14)' },
          { 12: '0px 7px 8px rgba(0, 0, 0, 0.2), 0px 5px 22px rgba(0, 0, 0, 0.12), 0px 12px 17px rgba(0, 0, 0, 0.14)' },
          {
            16: '0px 8px 10px rgba(0, 0, 0, 0.2), 0px 6px 30px rgba(0, 0, 0, 0.12), 0px 16px 24px rgba(0, 0, 0, 0.14)',
          },
          {
            24: '0px 11px 15px rgba(0, 0, 0, 0.2), 0px 9px 46px rgba(0, 0, 0, 0.12), 0px 24px 38px rgba(0, 0, 0, 0.14)',
          },
        ],
      },

      ta: {
        property: 'text-align',
        responsive: true,
        values: ['center', 'end', 'start'],
      },

      w: {
        property: 'width',
        responsive: true,
        values: getPercentSizes(),
      },
    },
  },

  setup(options, nuxt) {
    const { resolve } = createResolver(import.meta.url)

    const filePath = resolve('./runtime/index.css')
    const fileContents = () => [getGrid(options), getUtilities(options)].join('\n\n')

    fs.writeFileSync(filePath, fileContents())

    nuxt.options.css.push(filePath)
  },
})

/* Generates Bootstrap-like grid based on `grid` field from module settings */
function getGrid(options: UiModuleOptions) {
  const gap = getCSSUnit(options.grid.gap)

  /* Generate container classes and media queries */
  const containers = () => {
    const lines = [
      `.container,
      .container-full {
        max-width: 100%;
        margin-left: auto;
        margin-right: auto;
        padding: 0 ${gap};
      }`,
    ]

    Object.entries(options.grid.containerWidths).forEach(([key, value]) => {
      const breakpoint = options.grid.breakpoints[key]

      lines.push(`@media (min-width: ${getCSSUnit(breakpoint)}) { .container { width: ${getCSSUnit(value)}; } }`)
    })

    return lines.join('\n')
  }

  /* Generate row classes and media queries */
  const rows = () => {
    const lines = [
      `.row {
        display: flex;
        flex-wrap: wrap;
        column-gap: ${gap};
      }

      .row > * {
        min-width: 0;
      }`,
    ]

    const flexBasis = (count: number) => `calc((100% - ${count - 1} * ${gap}) / ${count})`

    for (let count = 2; count <= 11; count++) {
      lines.push(`.row-cols-${count} > .col { flex-basis: ${flexBasis(count)}; }`)

      Object.entries(options.grid.breakpoints).forEach(([key, value]) => {
        if (!value) return

        lines.push(
          `@media (min-width: ${getCSSUnit(value)}) { .row-cols-${key}-${count} > .col { flex-basis: ${flexBasis(count)}; } }`
        )
      })
    }

    return lines.join('\n')
  }

  /* Generate column classes and media queries */
  const columns = () => {
    const lines = [
      `.col { flex: 1 0 0%; }
      .col-auto { flex: 0 0 auto; width: auto; }`,
    ]

    const columnWidth = (count: number) => `calc((100% - ${gap} * 11) * ${count} / 12 + ${gap} * (${count - 1}))`

    const offset = (count: number) => {
      if (!count) return 0
      return `calc((100% - ${gap} * 11) * ${count} / 12 + ${gap} * (${count}))`
    }

    for (let count = 1; count <= 12; count++) {
      lines.push(`.col-${count} { flex: 0 0 auto; width: ${columnWidth(count)}; }`)

      if (count < 12) {
        lines.push(`.offset-${count} { margin-left: ${offset(count)}; }`)
      }
    }

    Object.entries(options.grid.breakpoints).forEach(([key, value]) => {
      if (!value) return

      lines.push(`@media (min-width: ${getCSSUnit(value)}) { .col-${key}-auto { flex: 0 0 auto; width: auto; } }`)

      for (let count = 1; count <= 12; count++) {
        lines.push(
          `@media (min-width: ${getCSSUnit(value)}) { .col-${key}-${count} { width: ${columnWidth(count)}; } }`
        )

        lines.push(
          `@media (min-width: ${getCSSUnit(value)}) { .offset-${key}-${count - 1} { margin-left: ${offset(count - 1)}; } }`
        )
      }
    })

    return lines.join('\n')
  }

  return [containers(), rows(), columns()].join('\n')
}

/* Generate utility classes */
function getUtilities(options: UiModuleOptions) {
  const lines: string[] = []

  const rule = (prefix: string, property: string, value: UtilityDefinition['values'][number], breakpoint?: string) => {
    let classname: string
    let propertyValue: PropertyValue

    if (value && typeof value === 'object') {
      const [[key, val]] = Object.entries(value as Record<string, PropertyValue>)
      classname = breakpoint ? `${prefix}-${breakpoint}-${key}` : `${prefix}-${key}`
      propertyValue = val
    } else {
      classname = breakpoint ? `${prefix}-${breakpoint}-${value}` : `${prefix}-${value}`
      propertyValue = value
    }

    return `.${classname} { ${property}: ${propertyValue} !important; }`
  }

  Object.entries(options.utilities).forEach(([prefix, definition]) => {
    if (!definition) return

    const { property, responsive, values } = definition

    values.forEach((value) => {
      if (Array.isArray(property)) {
        property.forEach((singleProperty) => {
          lines.push(rule(prefix, singleProperty, value))
        })
      } else {
        lines.push(rule(prefix, property, value))
      }
    })

    if (responsive) {
      Object.entries(options.grid.breakpoints).forEach(([breakpoint, width]) => {
        if (!width) return

        values.forEach((value) => {
          if (Array.isArray(property)) {
            property.forEach((singleProperty) => {
              lines.push(
                `@media (min-width: ${getCSSUnit(width)}) { ${rule(prefix, singleProperty, value, breakpoint)} }`
              )
            })
          } else {
            lines.push(`@media (min-width: ${getCSSUnit(width)}) { ${rule(prefix, property, value, breakpoint)} }`)
          }
        })
      })
    }
  })

  return lines.join('\n')
}

/* Convert number values to CSS size in pixels, return string values as is */
function getCSSUnit(value: PropertyValue) {
  if (!value) return value

  if (!isNaN(Number(value))) {
    return `${value}px`
  }

  return value
}

/* Generate relative percent-based sizes (for width & height) */
function getPercentSizes() {
  return [{ '0': '0', '25': '25%', '50': '50%', '75': '75%', '100': '100%', auto: 'auto' }]
}

/* Generate absolute rem-based sizes (for margins, paddings, font-sizes, etc.) */
function getRemSizes(withAuto?: boolean) {
  const sizes: Record<string, string>[] = []

  let i = 0

  while (i <= 96) {
    if (i) {
      sizes.push({ [String(i)]: `${i / 16}rem` })
    } else {
      sizes.push({ '0': '0' })
    }

    if (i < 24) i += 2
    else i += 4
  }

  if (withAuto) {
    sizes.push({ auto: 'auto' })
  }

  return sizes
}
