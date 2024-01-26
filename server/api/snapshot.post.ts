import { snapshotCreateMutation } from '~/gql'

export default defineEventHandler(async (event) => {
  const { client, headers } = event.context
  const query = getQuery(event)

  const balance = Number(query.balance)
  const created_at = String(query.created_at)
  const note = String(query.note)

  const { data, error } = await client
    .mutation(snapshotCreateMutation, { data: { balance, created_at, note } }, { fetchOptions: { headers } })
    .toPromise()

  if (error) {
    return { data: null, error }
  }

  return { data, error: null }
})
