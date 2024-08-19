import { useRuntimeConfig } from '#imports'
import { DrizzlePostgreSQLAdapter } from '@lucia-auth/adapter-drizzle'
import { drizzle, type NodePgDatabase } from 'drizzle-orm/node-postgres'
import { Lucia } from 'lucia'
import pg from 'pg'
import * as schema from '../db/schema'

export default defineNitroPlugin(async (nitroApp) => {
  const config = useRuntimeConfig()

  let db: NodePgDatabase<typeof schema>
  let lucia: Lucia

  /* Initialize Drizzle & Lucia */
  async function createConnection() {
    const client = new pg.Client({ connectionString: config.postgresUrl })

    /* Recreate Drizzle & Lucia on DB connection error */
    client.on('error', (error) => {
      console.log('DB client error', error)
      return createConnection()
    })

    await client.connect()

    db = drizzle(client, { schema })
    lucia = await getLucia(db)
  }

  await createConnection()

  /* Add Drizzle & Lucia to the request event context */
  nitroApp.hooks.hook('request', async (event) => {
    if (!db) await createConnection()

    event.context.db = db
    event.context.lucia = lucia
  })
})

/* Initialize Lucia */
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
