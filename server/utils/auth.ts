import { Lucia } from 'lucia'
import { DrizzlePostgreSQLAdapter } from '@lucia-auth/adapter-drizzle'
import { SessionsTable, UsersTable } from '../db/schema'
import { getDrizzle } from './drizzle'
import type { H3Event } from 'h3'

export async function getLucia() {
  const db = await getDrizzle()
  const adapter = new DrizzlePostgreSQLAdapter(db, SessionsTable, UsersTable)

  return new Lucia(adapter, {
    sessionCookie: {
      attributes: {
        secure: !import.meta.dev,
      },
    },
    getUserAttributes: (attributes) => ({ username: attributes.name }),
  })
}

export function checkUser(event: H3Event) {
  if (!event.context.user) {
    throw createError({
      message: 'Unauthorized',
      statusCode: 401,
    })
  }
}

declare module 'lucia' {
  interface Register {
    Lucia: typeof Lucia
    DatabaseUserAttributes: DatabaseUserAttributes
    UserId: number
  }
}

interface DatabaseUserAttributes {
  email: string
  name: string
}
