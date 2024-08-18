import { desc, eq, getTableColumns } from 'drizzle-orm'
import writeXlsxFile from 'write-excel-file/node'
import { CategoriesTable, TransactionsTable } from '~/server/db/schema'
import type { Transaction } from '~/types'

export default defineEventHandler({
  onRequest: [checkUser],

  handler: async (event) => {
    const { db } = event.context

    const transactions = await db
      .select({
        ...getTableColumns(TransactionsTable),
        category: CategoriesTable,
      })
      .from(TransactionsTable)
      .leftJoin(CategoriesTable, eq(TransactionsTable.categoryId, CategoriesTable.id))
      .orderBy(desc(TransactionsTable.createdAt), desc(TransactionsTable.id))

    const schema = [
      {
        column: 'Дата',
        type: String,
        value: (transaction: Transaction) => transaction.createdAt,
      },
      {
        column: 'Сумма',
        type: Number,
        value: (transaction: Transaction) => transaction.sum,
      },
      {
        column: 'Категория',
        type: String,
        value: (transaction: Transaction) => transaction.category?.name ?? transaction.categoryId,
      },
      {
        column: 'Комментарий',
        type: String,
        value: (transaction: Transaction) => transaction.note,
      },
    ]

    return writeXlsxFile(transactions, { schema, buffer: true })
  },
})
