import { getServerSession, getToken } from '#auth'

export default defineEventHandler(async (event) => {
  const session = await getServerSession(event)
  if (!session) {
    throw createError({ statusMessage: 'Unauthenticated', statusCode: 403 })
  }

  const config = useRuntimeConfig()
  const token = await getToken({ event })
  const query = await getQuery(event)
  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token?.accessToken}`,
  }

  const response = await $fetch(`${config.API_URL}/records/${query.id}`, { method: 'DELETE', headers })

  return response
})
