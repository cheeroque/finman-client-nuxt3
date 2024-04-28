import { TransactionsExportMutation } from '~/graphql'

export default defineEventHandler(async (event) => {
  const { client, headers } = event.context

  const { data, error } = await client
    .mutation(TransactionsExportMutation, {}, { fetchOptions: { headers } })
    .toPromise()

  if (error) {
    throw error
  }

  return { result: data?.result }
})
