import { useRuntimeConfig } from '#imports'
import { createClient, fetchExchange } from '@urql/core'

import type { Client } from '@urql/vue'

export default defineNitroPlugin((nitroApp) => {
  const config = useRuntimeConfig()

  const urqlClient = createClient({
    url: config.gqlEndpoint,
    exchanges: [fetchExchange],
  })

  nitroApp.hooks.hook('request', (event) => {
    event.context.client = urqlClient
  })
})

declare module 'h3' {
  interface H3EventContext {
    client: Client
  }
}
