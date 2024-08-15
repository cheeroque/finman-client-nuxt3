import { drizzle, type NodePgDatabase } from 'drizzle-orm/node-postgres'
import pg from 'pg'
import * as schema from '../db/schema'

export async function useDrizzle() {
  const client = new pg.Client()
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
