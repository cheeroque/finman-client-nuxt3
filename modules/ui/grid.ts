import { getCSSUnit } from './helpers'
import type { UiModuleOptions } from './types'

/* Generates Bootstrap-like grid based on `grid` field from module settings */
export function getGrid(options: UiModuleOptions) {
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
