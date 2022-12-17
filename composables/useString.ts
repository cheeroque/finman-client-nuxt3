import * as ru from '~/locales/ru.json'

type Locale = { [key: string]: string }

const localeRu: Locale = ru

export const useString = (key: string): string => localeRu[key as keyof Locale] ?? key
