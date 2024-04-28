import { readFragment, LoginMutation, UserFragment } from '~/graphql'
import { parseJwt } from '~/utils'

export default defineEventHandler(async (event) => {
  const { client } = event.context
  const body = await readBody(event)

  const { data, error } = await client.mutation(LoginMutation, body).toPromise()

  if (error) {
    const statusCode = error?.message.includes('Authentication exception') ? 401 : undefined
    throw createError({ statusCode })
  }

  const token = data?.login.access_token
  const user = readFragment(UserFragment, data?.login.user)

  const expires = new Date(parseJwt(token).exp * 1000).toUTCString()

  /* Pass auth token to the client as http-only secure cookie
   * inside `set-cookie` header */

  if (token) {
    setResponseHeader(event, 'set-cookie', [`auth_token=${token}; Expires=${expires}; Path=/; Secure; HttpOnly`])
  }

  return { user }
})
