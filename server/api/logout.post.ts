import { logoutMutation } from '~/gql'

export default defineEventHandler(async (event) => {
  const { client, headers } = event.context

  const { data, error } = await client.mutation(logoutMutation, {}, { fetchOptions: { headers } }).toPromise()

  /* Remove auth token client-side cookie by passing `set-cookie` header
   * with expiration date in the past */

  setResponseHeader(event, 'set-cookie', [
    `auth_token=deleted; Expires=Thu, 01 Jan 1970 00:00:00 GMT; Path=/; Secure; HttpOnly`,
  ])

  if (error) {
    throw error
  }

  return { data }
})
