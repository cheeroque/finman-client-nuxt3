import { eq } from 'drizzle-orm'
import { TransactionsTable } from '~/server/db/schema'
import type { TransactionInsert } from '~/types'

export default defineEventHandler({
  onRequest: [checkUser],

  handler: async (event) => {
    const db = await getDrizzle()
    const body = await readBody<TransactionInsert>(event)

    const id = event.context.params?.id

    if (isNaN(Number(id))) {
      throw createError({
        message: 'Transaction ID is required!',
        statusCode: 402,
      })
    }

    const [result] = await db
      .update(TransactionsTable)
      .set(body)
      .where(eq(TransactionsTable.id, Number(id)))
      .returning({ id: TransactionsTable.id })

    if (!result) {
      throw createError({
        message: 'Transaction not found!',
        statusCode: 404,
      })
    }

    return { result }
  },
})
