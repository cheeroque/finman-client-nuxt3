import { DateTime, DateTimeFormatOptions } from 'luxon'

export function useDateFormat(
  datestring: string,
  options: DateTimeFormatOptions = { dateStyle: 'short' },
  locale?: string
): string {
  return DateTime.fromFormat(datestring, 'yyyy-LL-dd HH:mm:ss').toLocaleString(options, {
    locale: locale ?? useLocale(),
  })
}
