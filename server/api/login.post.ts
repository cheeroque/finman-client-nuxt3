import { parseJwt } from '~/utils/jwt'
import { loginMutation } from '~/gql'

export default defineEventHandler(async (event) => {
  const { client } = event.context
  const body = await readBody(event)

  const { data, error } = await client.mutation(loginMutation, body).toPromise()

  if (error) throw error

  const token = data?.login.access_token
  const user = data?.login.user

  const expires = new Date(parseJwt(token).exp * 1000).toUTCString()

  /* Pass auth token to the client as http-only secure cookie
   * inside `set-cookie` header */

  if (token) {
    setResponseHeader(event, 'set-cookie', [`auth_token=${token}; Expires=${expires}; Path=/; Secure; HttpOnly`])
  }

  return { user }
})
