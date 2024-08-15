import { Lucia } from 'lucia'
import { DrizzlePostgreSQLAdapter } from '@lucia-auth/adapter-drizzle'
import { SessionsTable, UsersTable } from '../db/schema'
import { useDrizzle } from './drizzle'

const db = await useDrizzle()
const adapter = new DrizzlePostgreSQLAdapter(db, SessionsTable, UsersTable)

export const lucia = new Lucia(adapter, {
  sessionCookie: {
    attributes: {
      secure: !import.meta.dev,
    },
  },
  getUserAttributes: (attributes) => ({ username: attributes.username }),
})

declare module 'lucia' {
  interface Register {
    Lucia: typeof lucia
    DatabaseUserAttributes: DatabaseUserAttributes
    UserId: number
  }
}

interface DatabaseUserAttributes {
  username: string
}
