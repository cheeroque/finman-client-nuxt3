import { UseFetchOptions } from '#app'
import { NitroFetchRequest } from 'nitropack'
import { KeyOfRes } from 'nuxt/dist/app/composables/asyncData'

import { useAuthStore } from '@/store/auth'

export function useApiFetch<T>(
  request: NitroFetchRequest,
  options?:
    | UseFetchOptions<
        T extends void ? unknown : T,
        (res: T extends void ? unknown : T) => T extends void ? unknown : T,
        KeyOfRes<(res: T extends void ? unknown : T) => T extends void ? unknown : T>
      >
    | undefined
) {
  const auth = useAuthStore()

  if (auth?.token) {
    const config = useRuntimeConfig()
    const headers = {}
    headers['Authorization'] = `Bearer ${auth.token}`
    return useFetch<T>(request, { baseURL: config.public.apiUrl, headers, ...options })
  } else {
    auth.logout()
  }
}
