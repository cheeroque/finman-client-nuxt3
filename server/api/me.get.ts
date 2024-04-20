import { MeQuery } from '~/graphql'

export default defineEventHandler(async (event) => {
  const { client, headers } = event.context

  const { data, error } = await client.query(MeQuery, {}, { fetchOptions: { headers } }).toPromise()

  if (error) {
    throw error
  }

  return { data }
})
