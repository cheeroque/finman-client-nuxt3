type scrollTarget = string | HTMLElement | null
type scrollBehavior = 'auto' | 'smooth'

export function useScrollTo(target: scrollTarget = null, behavior: scrollBehavior = 'smooth'): void {
  if (!process.client) return

  let targetEl
  if (target) {
    if (typeof target === 'string') {
      targetEl = document.querySelector(target)
    } else {
      targetEl = target
    }
  }
  targetEl.scrollTo({ top, behavior })
}
