import { Lucia } from 'lucia'
import { DrizzlePostgreSQLAdapter } from '@lucia-auth/adapter-drizzle'
import { SessionsTable, UsersTable } from '../db/schema'
import { getDrizzle } from './drizzle'

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
