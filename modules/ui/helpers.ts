import type { UiPropertyValue } from './types'

/* Convert number values to CSS size in pixels, return string values as is */
export function getCSSUnit(value: UiPropertyValue) {
  if (!value) return value

  if (!isNaN(Number(value))) {
    return `${value}px`
  }

  return value
}

/* Generate relative percent-based sizes (for width & height) */
export function getPercentSizes() {
  return [{ '0': '0', '25': '25%', '50': '50%', '75': '75%', '100': '100%', auto: 'auto' }]
}

/* Generate absolute rem-based sizes (for margins, paddings, font-sizes, etc.) */
export function getRemSizes(withAuto?: boolean) {
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
