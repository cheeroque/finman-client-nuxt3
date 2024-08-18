import { and, desc, eq, gte, lt, sql, sum } from 'drizzle-orm'
import { DateTime } from 'luxon'
import { TransactionsTable } from '~/server/db/schema'

type CategoryQueryParams = {
  slug: string
  year?: string
}

export default defineEventHandler({
  onRequest: [checkUser],

  handler: async (event) => {
    const { db } = event.context
    const { slug, year } = getQuery<CategoryQueryParams>(event)

    if (!slug) {
      throw createError({
        message: 'Category slug is required!',
        statusCode: 400,
      })
    }

    const currentYear = Number(year) || DateTime.now().year

    const start = DateTime.fromObject({ year: currentYear })
    const startString = start.toSQL() as string

    const end = start.plus({ year: 1 })
    const endString = end.toSQL() as string

    const category = await db.query.CategoriesTable.findFirst({
      where: (categories, { eq }) => eq(categories.slug, slug),
    })

    if (!category) {
      throw createError({
        message: 'Category not found!',
        statusCode: 404,
      })
    }

    const transactions = await db
      .select({
        group: sql`to_char(date_trunc('month', ${TransactionsTable.createdAt}), 'YYYY-MM')`,
        subtotal: sum(TransactionsTable.sum),
        transactions: sql`json_agg(row_to_json(${TransactionsTable}))`,
      })
      .from(TransactionsTable)
      .where(
        and(
          eq(TransactionsTable.categoryId, category.id),
          gte(TransactionsTable.createdAt, startString),
          lt(TransactionsTable.createdAt, endString)
        )
      )
      .groupBy(({ group }) => group)
      .orderBy(({ group }) => desc(group))

    return { category, transactions }
  },
})
