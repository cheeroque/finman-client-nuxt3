export function parseJwt(token?: string | null) {
  if (!token) return

  try {
    return JSON.parse(atob(token.split('.')[1]))
  } catch (e) {
    return
  }
}
