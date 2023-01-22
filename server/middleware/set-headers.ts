export default defineEventHandler((event) => {
  const config = useRuntimeConfig()
  const cookieName = config.TOKEN_COOKIE_NAME
  const token = getCookie(event, cookieName)

  const headers: Record<string, string> = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  }
  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  event.context.headers = headers
})
