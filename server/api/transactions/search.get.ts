import { count, ilike } from 'drizzle-orm'
import { TransactionsTable } from '~/server/db/schema'

type TransactionsSearchQueryParams = {
  q: string
  page?: string
  perPage?: string
}

const PER_PAGE_DEFAULT = 50

export default defineEventHandler({
  onRequest: [checkUser],

  handler: async (event) => {
    const { db } = event.context
    const { q, page, perPage } = getQuery<TransactionsSearchQueryParams>(event)

    if (!q) {
      throw createError({
        message: 'Search query is required!',
        statusCode: 400,
      })
    }

    const currentPage = Number(page) || 1
    const limit = Number(perPage) || PER_PAGE_DEFAULT
    const offset = limit * (currentPage - 1)

    const transactions = await db.query.TransactionsTable.findMany({
      where: (transactions, { ilike }) => ilike(transactions.note, `%${q}%`),
      with: {
        category: true,
      },
      limit,
      offset,
    })

    const [{ total }] = await db
      .select({ total: count() })
      .from(TransactionsTable)
      .where(ilike(TransactionsTable.note, `%${q}%`))

    const totalPages = Math.ceil(total / limit)

    return { transactions, total, totalPages }
  },
})
