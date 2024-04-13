export function getContrastColor(hex?: string | null, dark = '#000', light = '#fff') {
  if (!hex?.length) return dark

  const rgb = []
  const threshold = 165

  /* Remove hash from hex color string */
  let color = hex.substring(1)

  /* Normalize 3-digit color to 6-digit */
  if (color.length === 3) {
    color = color
      .split('')
      .map((ch) => `${ch}${ch}`)
      .join('')
  }

  /* Get 10-base R, G & B values */
  for (let i = 0; i < 3; i++) {
    rgb[i] = parseInt(color.substring(i * 2, i * 2 + 2), 16)
  }

  const lightness = 0.2126 * rgb[0] + 0.7152 * rgb[1] + 0.0722 * rgb[2]

  return lightness >= threshold ? dark : light
}

export function getWindowTop() {
  if (!process.client) return 0

  return Math.max(document?.documentElement?.scrollTop, document?.body?.scrollTop) ?? 0
}

export function parseJwt(token?: string | null) {
  if (!token) return

  try {
    return JSON.parse(atob(token.split('.')[1]))
  } catch (e) {
    return
  }
}

export function scrollToEl(target: HTMLElement | string | null, top = 0, behavior: 'auto' | 'smooth' = 'smooth') {
  if (!process.client) return

  let targetEl: Window | HTMLElement = window

  if (typeof target === 'string') {
    const queryResult = document.querySelector(target)

    if (queryResult instanceof HTMLElement) {
      targetEl = queryResult
    }
  }

  if (target instanceof HTMLElement) {
    targetEl = target
  }

  targetEl.scrollTo({ top, behavior })
}
