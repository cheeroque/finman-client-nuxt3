import { eq } from 'drizzle-orm'
import { TransactionsTable } from '~/server/db/schema'

export default defineEventHandler({
  onRequest: [checkUser],

  handler: async (event) => {
    const { db, params } = event.context
    const id = params?.id

    if (isNaN(Number(id))) {
      throw createError({
        message: 'Transaction ID is required!',
        statusCode: 402,
      })
    }

    const [result] = await db
      .delete(TransactionsTable)
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
