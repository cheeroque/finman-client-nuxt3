import * as ru from '~/locales/ru.json'

type Locale = { [key: string]: string }

const localeRu: Locale = ru

export const useString = (key: string, replace?: string): string => {
  let resultString = localeRu[key as keyof Locale] ?? key
  if (replace?.length) {
    resultString = resultString.replaceAll('%s', replace)
  }
  return resultString
}
