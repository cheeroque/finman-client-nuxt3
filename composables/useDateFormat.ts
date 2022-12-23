import { DateTime, DateTimeFormatOptions } from 'luxon'

export function useDateFormat(
  datestring: string,
  options: DateTimeFormatOptions = { dateStyle: 'short' },
  locale?: string
): string {
  return DateTime.fromISO(datestring).toLocaleString(options, { locale: locale ?? useLocale() })
}
