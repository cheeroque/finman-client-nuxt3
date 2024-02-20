import { categoriesWithTransactionsQuery } from '~/gql'
import { CategoryTransactionsWhereColumn, CategoryTransactionsTotalWhereColumn, SqlOperator } from '~/gen/gql/graphql'

import type {
  CategoryTransactionsWhereWhereConditions,
  CategoryTransactionsTotalWhereWhereConditions,
} from '~/gen/gql/graphql'

import type { TableMonthItem } from '~/types'

export default defineEventHandler(async (event) => {
  const { client, headers } = event.context
  const query = getQuery(event)

  const where: CategoryTransactionsWhereWhereConditions = {
    AND: [
      {
        column: CategoryTransactionsWhereColumn.CreatedAt,
        operator: SqlOperator.Gte,
        value: query.from,
      },
      {
        column: CategoryTransactionsWhereColumn.CreatedAt,
        operator: SqlOperator.Lte,
        value: query.to,
      },
    ],
  }

  const whereTotal: CategoryTransactionsTotalWhereWhereConditions = {
    AND: [
      {
        column: CategoryTransactionsTotalWhereColumn.CreatedAt,
        operator: SqlOperator.Gte,
        value: query.from,
      },
      {
        column: CategoryTransactionsTotalWhereColumn.CreatedAt,
        operator: SqlOperator.Lte,
        value: query.to,
      },
    ],
  }

  const { data, error } = await client
    .query(categoriesWithTransactionsQuery, { where, whereTotal }, { fetchOptions: { headers } })
    .toPromise()

  if (error) {
    throw error
  }

  const categories = data?.categories?.data ?? []

  /* Transform categories to table items, calculate total expenses & balance */

  const tableItems: TableMonthItem[] = []
  let balance = 0
  let totalExpenses = 0

  categories?.forEach(({ color, id, is_income, name, transactions, transactionsTotal, slug }) => {
    const subtotal = Number(transactionsTotal) || 0

    if (is_income) {
      balance += subtotal
    } else {
      balance -= subtotal
      totalExpenses += subtotal
    }

    /* Add to table items only categories that have transactions this month */

    if (transactions?.length) {
      tableItems.push({
        category: { color, id, is_income, name, slug },
        group: name,
        transactions,
        subtotal,
        trClass: is_income ? 'row-income' : undefined,
      })
    }
  })

  /* Sort table items by `is_income` descending, then by `subtotal` descending */

  tableItems.sort(
    (a, b) => Number(a.category?.is_income) - Number(b.category?.is_income) || Number(b.subtotal) - Number(a.subtotal)
  )

  return { balance, tableItems, totalExpenses }
})
