import type { H3Event } from 'h3'

export function checkUser(event: H3Event) {
  if (!event.context.user) {
    throw createError({
      message: 'Unauthorized',
      statusCode: 401,
    })
  }
}
