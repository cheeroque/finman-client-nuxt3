export function useNumberFormat(number: number = 0, locale?: string, precision: number = 0): string {
  return number.toLocaleString(locale ?? useLocale(), {
    minimumFractionDigits: precision,
    maximumFractionDigits: precision,
  })
}
