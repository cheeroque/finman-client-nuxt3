import { defineConfig } from 'drizzle-kit'

export default defineConfig({
  dbCredentials: { url: process.env.NUXT_POSTGRES_URL ?? '' },
  dialect: 'postgresql',
  schema: './server/db/schema.ts',
  out: './server/db/migrations',
})
