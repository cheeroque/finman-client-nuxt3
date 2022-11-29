export function useNumberFormat(number: number = 0, locale: string = 'ru', precision: number = 0): string {
  return number.toLocaleString(locale, {
    minimumFractionDigits: precision,
    maximumFractionDigits: precision,
  })
}
