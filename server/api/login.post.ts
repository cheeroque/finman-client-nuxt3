import { verify } from '@node-rs/argon2'
import type { LoginCredentials } from '~/types'

export default defineEventHandler(async (event) => {
  const { db, lucia } = event.context
  const { password, username } = await readBody<LoginCredentials>(event)

  const existingUser = await db.query.UsersTable.findFirst({
    where: (users, { eq }) => eq(users.name, username),
  })

  if (!existingUser) {
    throw createError({
      message: 'Incorrect username or password (username actually)',
      statusCode: 400,
    })
  }

  const validPassword = await verify(existingUser.password, password, {
    memoryCost: 19456,
    timeCost: 2,
    outputLen: 32,
    parallelism: 1,
  })

  if (!validPassword) {
    throw createError({
      message: 'Incorrect username or password',
      statusCode: 400,
    })
  }

  const session = await lucia.createSession(existingUser.id, {})
  appendHeader(event, 'Set-Cookie', lucia.createSessionCookie(session.id).serialize())
})
