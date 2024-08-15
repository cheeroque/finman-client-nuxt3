import { asc, eq, sum } from 'drizzle-orm'
import { CategoriesTable, TransactionsTable } from '~/server/db/schema'

export default defineEventHandler({
  onRequest: [checkUser],

  handler: async () => {
    const db = await getDrizzle()

    const categories = await db.query.CategoriesTable.findMany({
      orderBy: (categories, { asc }) => [asc(categories.sortOrder), asc(categories.name)],
    })

    const firstTransaction = await db.query.TransactionsTable.findFirst({
      orderBy: (transactions, { asc }) => [asc(transactions.createdAt)],
      with: { category: true },
    })

    const [expenses, incomes] = await db
      .select({ isIncome: CategoriesTable.isIncome, sum: sum(TransactionsTable.sum) })
      .from(TransactionsTable)
      .leftJoin(CategoriesTable, eq(TransactionsTable.categoryId, CategoriesTable.id))
      .groupBy(CategoriesTable.isIncome)
      .orderBy(asc(CategoriesTable.isIncome))

    const balance = Number(incomes.sum) - Number(expenses.sum)

    return { balance, categories, firstTransaction }
  },
})
