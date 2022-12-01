type scrollTarget = string | HTMLElement | null
type scrollBehavior = 'auto' | 'smooth'

export function useScrollTo(target: scrollTarget = null, top: number = 0, behavior: scrollBehavior = 'smooth'): void {
  if (!process.client) return

  let targetEl
  if (target) {
    if (typeof target === 'string') {
      targetEl = document.querySelector(target)
    } else if (typeof target === 'object') {
      targetEl = target
    } else {
      targetEl = window
    }
  }
  if (!targetEl) return
  targetEl.scrollTo({ top, behavior })
}
