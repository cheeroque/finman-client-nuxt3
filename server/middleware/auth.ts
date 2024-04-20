/* Get httpOnly auth_token cookie from initial request and append it to
 * request context as authorization header */

export default defineEventHandler((event) => {
  const token = parseCookies(event).auth_token

  if (token) {
    event.context.headers = {
      authorization: `Bearer ${token}`,
    }
  }
})

declare module 'h3' {
  interface H3EventContext {
    headers?: {
      authorization: string
    }
  }
}
