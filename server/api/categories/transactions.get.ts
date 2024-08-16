import { count, desc, eq, getTableColumns, ilike, sql, sum } from 'drizzle-orm'
import { CategoriesTable, TransactionsTable } from '~/server/db/schema'

type CategoryQueryParams = {
  page?: string
  perPage?: string
  slug: string
}

const PER_PAGE_DEFAULT = 18

export default defineEventHandler({
  onRequest: [checkUser],

  handler: async (event) => {
    const db = await getDrizzle()
    const { page, perPage, slug } = getQuery<CategoryQueryParams>(event)

    if (!slug) {
      throw createError({
        message: 'Category slug is required!',
        statusCode: 400,
      })
    }

    const currentPage = Number(page) || 1
    const limit = Number(perPage) || PER_PAGE_DEFAULT
    const offset = limit * (currentPage - 1)

    const groups = await db
      .select({
        month: sql`date_trunc('month', ${TransactionsTable.createdAt})`,
        subtotal: sum(TransactionsTable.sum),
        transactions: sql`json_agg(row_to_json(${TransactionsTable}))`,
      })
      .from(TransactionsTable)
      .leftJoin(CategoriesTable, eq(TransactionsTable.categoryId, CategoriesTable.id))
      .where(eq(CategoriesTable.slug, slug))
      .limit(limit)
      .offset(offset)
      .groupBy(({ month }) => month)
      .orderBy(({ month }) => desc(month))

    const total = await db
      .select({
        month: sql`date_trunc('month', ${TransactionsTable.createdAt})`,
      })
      .from(TransactionsTable)
      .leftJoin(CategoriesTable, eq(TransactionsTable.categoryId, CategoriesTable.id))
      .where(eq(CategoriesTable.slug, slug))
      .groupBy(({ month }) => month)

    return { groups, total }
  },
})
