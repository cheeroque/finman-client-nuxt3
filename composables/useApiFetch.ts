import { FetchOptions } from 'ofetch'

export function useApiFetch(url: string, options?: FetchOptions) {
  const headers = useRequestHeaders(['cookie']) as HeadersInit
  return $fetch(url, { ...options, headers })
}
