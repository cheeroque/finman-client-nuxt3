export function useContrastColor(hex: string = '', dark: string = '#000', light: string = '#fff'): string {
  if (!hex.length) return dark

  const rgb = []
  let lightness = 255

  let color = hex.substring(1)

  /* Normalize color from #XXX to #XXXXXX */
  if (color.length === 3) {
    color = color
      .split('')
      .map((ch) => `${ch}${ch}`)
      .join('')
  }

  for (let i = 0; i < 3; i++) {
    rgb[i] = parseInt(color.substring(i * 2, i * 2 + 2), 16)
  }

  lightness = 0.2126 * rgb[0] + 0.7152 * rgb[1] + 0.0722 * rgb[2]

  return lightness >= 165 ? dark : light
}
