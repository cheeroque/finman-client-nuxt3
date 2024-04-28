import { DateTime } from 'luxon'
import { readFragment, CategoryTransactionsQuery, TransactionFragment } from '~/graphql'
import type { GroupTableItem } from '~/types'

export default defineEventHandler(async (event) => {
  const { client, headers } = event.context
  const query = getQuery(event)

  const variables = {
    first: Number(query.perPage) || 18,
    page: Number(query.page) || 1,
    slug: String(query.slug),
  }

  const { data, error } = await client
    .query(CategoryTransactionsQuery, variables, { fetchOptions: { headers } })
    .toPromise()

  if (error) throw error

  const transactions = data?.transactions?.data ?? []
  const totalPages = data?.transactions?.paginatorInfo.lastPage ?? 1

  /* Transform transactions to table items */

  const tableItems: GroupTableItem[] = []

  transactions?.forEach(({ period, transactions }) => {
    const date = DateTime.fromFormat(period, 'yyyy-LL')
    const group = date.valueOf()
    const subtotal = transactions?.reduce((acc, cur) => {
      const { sum } = readFragment(TransactionFragment, cur)
      return (acc += sum)
    }, 0)

    if (transactions?.length) {
      tableItems.push({ group, subtotal, transactions })
    }
  })

  return { tableItems, totalPages }
})
