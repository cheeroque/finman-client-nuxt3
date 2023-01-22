import jwt_decode, { JwtPayload } from 'jwt-decode'
import { DateTime } from 'luxon'
import { useApiError } from '~/composables/useApiError'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const url = `${config.API_URL}/login`
  const cookieName = config.TOKEN_COOKIE_NAME

  /* Build headers for request to backend */
  const headers: Record<string, string> = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  }

  /* Get login credentials from request body */
  const body = await readBody(event)

  try {
    const { access_token, user } = await $fetch<LoginResponse>(url, { method: 'POST', body, headers })

    /* Get token from response and save it to cookie */
    const decoded: JwtPayload = jwt_decode(access_token)
    const expires = DateTime.fromSeconds(decoded.exp || 0).toJSDate()
    const cookieOptions = {
      expires,
      httpOnly: true,
      path: '/',
      sameSite: true,
    }
    setCookie(event, cookieName, access_token, cookieOptions)

    return { user }
  } catch (error) {
    return useApiError(error)
  }
})
