import fetch from 'cross-fetch'
import { getIntrospectionQuery, buildClientSchema } from 'graphql'

export default async () => {
  const url = process.env.NUXT_GQL_ENDPOINT ?? ''

  const introspectionQuery = getIntrospectionQuery()

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query: introspectionQuery }),
  })

  const data = await response.json()

  return buildClientSchema(data.data)
}
