import { DateTime, DateTimeFormatOptions } from 'luxon'

export function useDateFormat(
  datestring: string,
  options: DateTimeFormatOptions = { dateStyle: 'short' },
  locale: string = 'ru'
): string {
  return DateTime.fromISO(datestring).toLocaleString(options, { locale })
}
