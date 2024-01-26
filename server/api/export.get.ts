import { transactionsExportMutation } from '~/gql'

export default defineEventHandler(async (event) => {
  const { client, headers } = event.context

  const { data, error } = await client
    .mutation(transactionsExportMutation, {}, { fetchOptions: { headers } })
    .toPromise()

  if (error) {
    return { data: null, error }
  }

  return { data, error: null }
})
