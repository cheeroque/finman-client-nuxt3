import { SnapshotCreateMutation } from '~/graphql'

export default defineEventHandler(async (event) => {
  const { client, headers } = event.context
  const query = getQuery(event)

  const balance = Number(query.balance)
  const created_at = String(query.created_at)
  const note = String(query.note)

  const { data, error } = await client
    .mutation(SnapshotCreateMutation, { data: { balance, created_at, note } }, { fetchOptions: { headers } })
    .toPromise()

  if (error) {
    throw error
  }

  return { result: data?.result }
})
