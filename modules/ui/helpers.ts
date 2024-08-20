import type { UiPropertyValue } from './types'

/* Convert number values to CSS size in pixels, return string values as is */
export function getCSSUnit(value: UiPropertyValue) {
  if (!value) return value

  if (!isNaN(Number(value))) {
    return `${value}px`
  }

  return value
}
