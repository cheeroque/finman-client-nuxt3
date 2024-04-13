import { transactionCreateMutation, transactionDeleteMutation, transactionUpdateMutation } from '~/gql'

export default defineEventHandler(async (event) => {
  const { client, headers } = event.context

  const { method } = event
  const query = getQuery(event)

  const category = { connect: String(query.category_id) }
  const created_at = String(query.created_at)
  const id = String(query.id)
  const note = String(query.note)
  const sum = Number(query.sum)
  const user = { connect: String(query.user_id) }

  let response, variables
  const options = { fetchOptions: { headers } }

  switch (method) {
    case 'POST':
      variables = { data: { category, created_at, note, sum, user } }
      response = await client.mutation(transactionCreateMutation, variables, options).toPromise()
      break

    case 'PUT':
      variables = { data: { category, created_at, id, note, sum, user } }
      response = await client.mutation(transactionUpdateMutation, variables, options).toPromise()
      break

    case 'DELETE':
      variables = { id }
      response = await client.mutation(transactionDeleteMutation, variables, options).toPromise()
      break

    default:
      throw new Error(`Method ${method} not supported`)
  }

  if (response.error) {
    throw response.error
  }

  return { result: response.data?.result }
})
