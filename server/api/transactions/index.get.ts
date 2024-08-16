import { count, desc, eq, getTableColumns } from 'drizzle-orm'
import { CategoriesTable, TransactionsTable } from '~/server/db/schema'
import type { ViewMode } from '~/types'

type TransactionsQueryParams = {
  page?: string
  perPage?: string
  view?: ViewMode
}

const PER_PAGE_DEFAULT = 50

export default defineEventHandler({
  onRequest: [checkUser],

  handler: async (event) => {
    const db = await getDrizzle()
    const { page, perPage, view } = getQuery<TransactionsQueryParams>(event)

    const currentPage = Number(page) || 1
    const limit = Number(perPage) || PER_PAGE_DEFAULT
    const offset = limit * (currentPage - 1)

    const transactions = await db
      .select({
        ...getTableColumns(TransactionsTable),
        category: CategoriesTable,
      })
      .from(TransactionsTable)
      .leftJoin(CategoriesTable, eq(TransactionsTable.categoryId, CategoriesTable.id))
      .where(view ? eq(CategoriesTable.isIncome, view === 'income') : undefined)
      .limit(limit)
      .offset(offset)
      .orderBy(desc(TransactionsTable.createdAt), desc(TransactionsTable.id))

    const [{ total }] = await db
      .select({ total: count() })
      .from(TransactionsTable)
      .leftJoin(CategoriesTable, eq(TransactionsTable.categoryId, CategoriesTable.id))
      .where(view ? eq(CategoriesTable.isIncome, view === 'income') : undefined)

    const totalPages = Math.ceil(total / limit)

    return { transactions, totalPages }
  },
})
