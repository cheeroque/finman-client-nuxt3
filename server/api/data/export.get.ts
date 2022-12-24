import { getServerSession, getToken } from '#auth'

export default defineEventHandler(async (event) => {
  const session = await getServerSession(event)
  if (!session) {
    throw createError({ statusMessage: 'Unauthenticated', statusCode: 403 })
  }

  const config = useRuntimeConfig()
  const token = await getToken({ event })

  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token?.accessToken}`,
  }

  const filePath = await $fetch(`${config.API_URL}/export`, { method: 'GET', headers })
  return `${config.STATIC_URL}/${filePath}`
})
