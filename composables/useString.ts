import * as ru from '@/locales/ru.json'

export const useString = (key: string): string => ru[key] ?? key
