import { createClient, fetchExchange, ssrExchange } from '@urql/core'
import { authExchange } from '@urql/exchange-auth'

import type { Client } from '@urql/core'
import type { SSRData } from '@urql/vue'
import type { AuthPlugin } from '~/types'

const SSR_KEY = '__URQL_DATA__'

export default defineNuxtPlugin((nuxtApp) => {
  const config = useRuntimeConfig()

  /* Initialize auth exchange:
   * https://formidable.com/open-source/urql/docs/advanced/authentication/ */

  const auth = authExchange(async ({ appendHeaders }) => {
    const $auth = nuxtApp.$auth as AuthPlugin | undefined

    return {
      /* Apply an auth token as header to each request, if present */

      addAuthToOperation(operation) {
        operation.context.requestPolicy = 'network-only'

        const token = $auth?.getToken()

        if (!token) return operation

        return appendHeaders(operation, {
          Authorization: `Bearer ${token}`,
        })
      },

      /* Called on CombinedError, should return true if auth error occured */

      didAuthError(error) {
        return false
      },

      /* Called on auth error, should trigger auth refresh or logout
       * (if refresh is not supported) */

      async refreshAuth() {
        const refreshToken = $auth?.getToken(true)

        if (refreshToken) {
          /* refresh auth state */
        } else {
          return $auth?.logout()
        }
      },
    }
  })

  /* Initialize SSR exchange:
   * https://github.com/gbicou/nuxt3-urql/blob/main/plugins/urql.ts */

  const ssr = ssrExchange({
    isClient: process.client,
  })

  if (process.client) {
    nuxtApp.hook('app:created', () => {
      ssr.restoreData(nuxtApp.payload[SSR_KEY] as SSRData)
    })
  }

  if (process.server) {
    nuxtApp.hook('app:rendered', () => {
      nuxtApp.payload[SSR_KEY] = ssr.extractData()
    })
  }

  const client = createClient({
    url: config.public.gqlEndpoint,
    exchanges: [ssr, auth, fetchExchange],
  })

  nuxtApp.provide('urql', client)
  nuxtApp.vueApp.provide('$urql', ref(client))
})

declare module '#app' {
  interface NuxtApp {
    $urql: Client
  }
}
