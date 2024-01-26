import { snapshotsQuery } from '~/gql'

export default defineEventHandler(async (event) => {
  const { client, headers } = event.context

  const { data, error } = await client.query(snapshotsQuery, {}, { fetchOptions: { headers } }).toPromise()

  if (error) throw error

  const snapshots = data?.snapshots?.data ?? []

  return { snapshots }
})
