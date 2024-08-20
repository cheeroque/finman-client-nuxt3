import { getCSSUnit } from './helpers'
import type { UiModuleOptions, UiPropertyValue, UiUtilityDefinition } from './types'

/* Generate utility classes */
export function getUtilities(options: UiModuleOptions) {
  const lines: string[] = []

  const rule = (
    prefix: string,
    property: string,
    value: UiUtilityDefinition['values'][number],
    breakpoint?: string
  ) => {
    let classname: string
    let propertyValue: UiPropertyValue

    if (value && typeof value === 'object') {
      const [[key, val]] = Object.entries(value as Record<string, UiPropertyValue>)
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
