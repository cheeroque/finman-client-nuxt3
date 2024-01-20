import { loginMutation } from '~/gql'

export default defineEventHandler(async (event) => {
  const { client } = event.context
  const body = await readBody(event)

  const { data, error } = await client.mutation(loginMutation, body).toPromise()

  if (error) throw error

  const token = data?.login.access_token
  const user = data?.login.user

  /* Pass auth token to the client as http-only secure cookie
   * inside `set-cookie` header */

  if (token) {
    setResponseHeader(event, 'set-cookie', [`auth_token=${token}; Path=/; Secure; HttpOnly`])
  }

  return { user }
})
