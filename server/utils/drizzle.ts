import { drizzle, type NodePgDatabase } from 'drizzle-orm/node-postgres'
import pg from 'pg'
import * as schema from '../db/schema'

export async function getDrizzle() {
  const client = new pg.Client({
    connectionString: process.env.NUXT_POSTGRES_URL,
  })

  await client.connect()

  client.on('error', (error) => {
    console.log('DB client error', error)
  })

  return drizzle(client, { schema })
}

declare module 'h3' {
  interface H3EventContext {
    db: () => NodePgDatabase<typeof schema>
  }
}
