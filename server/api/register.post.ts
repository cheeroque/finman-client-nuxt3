import { hash } from '@node-rs/argon2'
import { UsersTable } from '~/server/db/schema'

export default eventHandler(async (event) => {
  const { db, lucia } = event.context
  const formData = await readFormData(event)

  const username = formData.get('username')

  if (typeof username !== 'string' || username.length < 3 || username.length > 31) {
    throw createError({
      message: 'Invalid username',
      statusCode: 400,
    })
  }

  const password = formData.get('password')

  if (typeof password !== 'string' || password.length < 6 || password.length > 255) {
    throw createError({
      message: 'Invalid password',
      statusCode: 400,
    })
  }

  const passwordHash = await hash(password, {
    memoryCost: 19456,
    timeCost: 2,
    outputLen: 32,
    parallelism: 1,
  })

  const [newUser] = await db
    .insert(UsersTable)
    .values({
      email: username,
      name: username,
      password: passwordHash,
    })
    .returning({ id: UsersTable.id })

  const session = await lucia.createSession(newUser.id, {})
  appendHeader(event, 'Set-Cookie', lucia.createSessionCookie(session.id).serialize())
})
