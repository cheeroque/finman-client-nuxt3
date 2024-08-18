export default defineEventHandler(async (event) => {
  const { lucia, session } = event.context

  if (!session) {
    throw createError({
      statusCode: 403,
    })
  }

  await lucia.invalidateSession(session.id)

  appendHeader(event, 'Set-Cookie', lucia.createBlankSessionCookie().serialize())
})
