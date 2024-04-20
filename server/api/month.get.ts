import { readFragment, CategoriesWithTransactionsQuery, CategoryFragment } from '~/graphql'
import type { VariablesOf } from '~/graphql'
import type { TableMonthItem } from '~/types'

export default defineEventHandler(async (event) => {
  const { client, headers } = event.context
  const query = getQuery(event)

  const where: VariablesOf<typeof CategoriesWithTransactionsQuery>['where'] = {
    AND: [
      {
        column: 'CREATED_AT',
        operator: 'GTE',
        value: query.from,
      },
      {
        column: 'CREATED_AT',
        operator: 'LTE',
        value: query.to,
      },
    ],
  }

  const whereTotal: VariablesOf<typeof CategoriesWithTransactionsQuery>['whereTotal'] = {
    AND: [
      {
        column: 'CREATED_AT',
        operator: 'GTE',
        value: query.from,
      },
      {
        column: 'CREATED_AT',
        operator: 'LTE',
        value: query.to,
      },
    ],
  }

  const { data, error } = await client
    .query(CategoriesWithTransactionsQuery, { where, whereTotal }, { fetchOptions: { headers } })
    .toPromise()

  if (error) {
    throw error
  }

  const categories = data?.categories?.data ?? []

  /* Transform categories to table items, calculate total expenses & balance */

  const tableItems: TableMonthItem[] = []
  let balance = 0
  let totalExpenses = 0

  categories?.forEach((category) => {
    const { is_income, name } = readFragment(CategoryFragment, category)
    const { transactions, transactionsTotal } = category

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
        category,
        group: name,
        transactions,
        subtotal,
        trClass: is_income ? 'row-income' : undefined,
      })
    }
  })

  /* Sort table items by `is_income` descending, then by `subtotal` descending */

  tableItems.sort(
    (a, b) =>
      Number(readFragment(CategoryFragment, a.category)?.is_income) -
        Number(readFragment(CategoryFragment, b.category)?.is_income) || Number(b.subtotal) - Number(a.subtotal)
  )

  return { balance, tableItems, totalExpenses }
})
