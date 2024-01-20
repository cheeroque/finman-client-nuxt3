import { meQuery } from '~/gql/auth'

export default defineEventHandler(async (event) => {
  const { client, headers } = event.context

  const { data, error } = await client.query(meQuery, {}, { fetchOptions: { headers } }).toPromise()

  if (error) throw error

  return { data }
})
