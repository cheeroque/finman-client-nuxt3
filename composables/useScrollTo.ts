type scrollTarget = string | HTMLElement | undefined
type scrollBehavior = 'auto' | 'smooth'

export function useScrollTo(target: scrollTarget = undefined, top: number = 0, behavior: scrollBehavior = 'smooth') {
  if (!process.client) return

  let targetEl: Window | Element = window

  if (target) {
    if (typeof target === 'string') {
      targetEl = document.querySelector(target) ?? window
    } else if (typeof target === 'object') {
      targetEl = target
    } else {
      targetEl = window
    }
  }

  if (!targetEl) return

  targetEl.scrollTo({ top, behavior })
}
