import { useRuntimeConfig } from '#imports'
import { DrizzlePostgreSQLAdapter } from '@lucia-auth/adapter-drizzle'
import { drizzle, type NodePgDatabase } from 'drizzle-orm/node-postgres'
import { Lucia } from 'lucia'
import pg from 'pg'
import * as schema from '../db/schema'

export default defineNitroPlugin(async (nitroApp) => {
  const config = useRuntimeConfig()

  const db = await getDrizzle(config.postgresUrl)
  const lucia = await getLucia(db)

  nitroApp.hooks.hook('request', (event) => {
    event.context.db = db
    event.context.lucia = lucia
  })
})

async function getDrizzle(connectionString: string) {
  const client = new pg.Client({ connectionString })

  await client.connect()

  client.on('error', (error) => {
    console.log('DB client error', error)
  })

  return drizzle(client, { schema })
}

async function getLucia(db: NodePgDatabase<typeof schema>) {
  const adapter = new DrizzlePostgreSQLAdapter(db, schema.SessionsTable, schema.UsersTable)

  return new Lucia(adapter, {
    sessionCookie: {
      attributes: {
        secure: !import.meta.dev,
      },
    },
    getUserAttributes: (attributes) => ({ username: attributes.name }),
  })
}

declare module 'h3' {
  interface H3EventContext {
    db: NodePgDatabase<typeof schema>
    lucia: Lucia
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
