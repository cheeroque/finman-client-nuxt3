import { categoryCreateMutation, categoryDeleteMutation, categoryUpdateMutation } from '~/gql'

export default defineEventHandler(async (event) => {
  const { client, headers } = event.context

  const { method } = event
  const query = getQuery(event)

  const color = String(query.color)
  const id = String(query.id)
  const is_income = query.is_income === 'true'
  const name = String(query.name)
  const slug = String(query.slug)

  let response, variables
  const options = { fetchOptions: { headers } }

  switch (method) {
    case 'POST':
      variables = { data: { color, is_income, name, slug } }
      response = await client.mutation(categoryCreateMutation, variables, options).toPromise()
      break

    case 'PUT':
      variables = { data: { color, id, is_income, name, slug } }
      response = await client.mutation(categoryUpdateMutation, variables, options).toPromise()
      break

    case 'DELETE':
      variables = { id }
      response = await client.mutation(categoryDeleteMutation, variables, options).toPromise()
      break

    default:
      throw new Error(`Method ${method} not supported`)
  }

  if (response.error) {
    return { data: null, error: response.error }
  }

  return { data: response.data, error: null }
})
