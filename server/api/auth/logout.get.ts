export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const cookieName = config.TOKEN_COOKIE_NAME

  /* Remove auth cookie */
  const cookieOptions = {
    httpOnly: true,
    path: '/',
    sameSite: true,
  }
  deleteCookie(event, cookieName, cookieOptions)

  return true
})
