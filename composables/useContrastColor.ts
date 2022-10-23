export function useContrastColor(hex: string, defaultDark: string = '#000', defaultLight: string = '#fff'): string {
  if (!hex?.length) return defaultDark

  const color = hex.substring(1)
  const rgb = []
  let lightness = 255
  for (let i = 0; i < 3; i++) {
    rgb[i] = parseInt(color.substring(i * 2, i * 2 + 2), 16)
  }
  lightness = 0.2126 * rgb[0] + 0.7152 * rgb[1] + 0.0722 * rgb[2]

  return lightness >= 165 ? defaultDark : defaultLight
}
