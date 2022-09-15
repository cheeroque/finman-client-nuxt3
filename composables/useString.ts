import * as ru from '@/locales/ru.json'

export const useString = (key) => ru[key] ?? key
