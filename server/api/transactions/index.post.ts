import { TransactionsTable } from '~/server/db/schema'
import type { TransactionInsert } from '~/types'

export default defineEventHandler({
  onRequest: [checkUser],

  handler: async (event) => {
    const db = await getDrizzle()
    const body = await readBody<TransactionInsert>(event)

    const [result] = await db.insert(TransactionsTable).values(body).returning({ id: TransactionsTable.id })

    return { result }
  },
})
