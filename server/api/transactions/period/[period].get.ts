import { and, asc, desc, eq, gte, lt, sql, sum } from 'drizzle-orm'
import { DateTime } from 'luxon'
import { CategoriesTable, TransactionsTable } from '~/server/db/schema'

export default defineEventHandler({
  onRequest: [checkUser],

  handler: async (event) => {
    const db = await getDrizzle()

    const period = event.context.params?.period

    if (!period) {
      throw createError({
        message: 'Period is required!',
        statusCode: 400,
      })
    }

    const start = DateTime.fromFormat(period, 'yyyy-LL')

    if (!start.isValid) {
      throw createError({
        message: 'Invalid period!',
        statusCode: 400,
      })
    }

    const startString = start.toSQL() as string

    const end = start.plus({ month: 1 })
    const endString = end.toSQL() as string

    const transactions = await db
      .select({
        group: CategoriesTable.name,
        isIncome: CategoriesTable.isIncome,
        subtotal: sum(TransactionsTable.sum),
        transactions: sql`json_agg(row_to_json(${TransactionsTable}))`,
      })
      .from(TransactionsTable)
      .leftJoin(CategoriesTable, eq(TransactionsTable.categoryId, CategoriesTable.id))
      .where(and(gte(TransactionsTable.createdAt, startString), lt(TransactionsTable.createdAt, endString)))
      .groupBy(({ group, isIncome }) => [group, isIncome])
      .orderBy(({ isIncome, subtotal }) => [asc(isIncome), desc(subtotal)])

    let totalExpenses = 0
    let totalIncomes = 0

    transactions.forEach(({ isIncome, subtotal }) => {
      if (isIncome) totalIncomes += Number(subtotal)
      else totalExpenses += Number(subtotal)
    })

    return { totalExpenses, totalIncomes, transactions }
  },
})
