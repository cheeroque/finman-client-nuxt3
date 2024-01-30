import type { H3Event } from 'h3'

export default defineNuxtRouteMiddleware(async (to) => {
  const user = useSession()

  const isLoginPage = to.path.startsWith('/login')
  let isLoggedIn = Boolean(user.value)

  if (!isLoggedIn) {
    /* If no user saved in global state, try to fetch it from API. On fail,
     * return redirect to login page */

    try {
      /* Get cookie header from initial client request */

      const headers = buildHeaders(useRequestEvent())

      const { data } = await $fetch('/api/me', { headers })

      if (data?.me) {
        user.value = data.me
        isLoggedIn = true
      } else {
        throw createError({ statusCode: 401 })
      }
    } catch (error: any) {
      if (!isLoginPage) {
        return navigateTo('/login', { external: true })
      }
    }
  }

  /* Check isLoggedIn again, it will be true if user was successfully fetched.
   * If true, redirect from login page */

  if (isLoggedIn && isLoginPage) {
    return navigateTo('/')
  }
})

function buildHeaders(event: H3Event) {
  const headers: HeadersInit = {}

  if (process.server) {
    headers.cookie = event.node.req.headers.cookie ?? ''
  }

  return headers
}
