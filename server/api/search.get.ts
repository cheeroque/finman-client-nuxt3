import { TransactionsQuery } from '~/graphql'
import type { VariablesOf } from '~/graphql'

export default defineEventHandler(async (event) => {
  const { client, headers } = event.context
  const query = getQuery(event)

  /* Find transactions by note content */

  const where: VariablesOf<typeof TransactionsQuery>['where'] = {
    OR: [{ column: 'NOTE', operator: 'LIKE', value: `%${query.q}%` }],
  }

  /* If search query can be cast to number, find transactions by exact sum */

  if (!isNaN(Number(query.q)) && Array.isArray(where.OR)) {
    where.OR.push({ column: 'SUM', operator: 'EQ', value: query.q })
  }

  const variables: VariablesOf<typeof TransactionsQuery> = {
    first: Number(query.perPage) || 50,
    orderBy: [{ column: 'CREATED_AT', order: 'DESC' }],
    page: Number(query.page) || 1,
    where,
  }

  const { data, error } = await client.query(TransactionsQuery, variables, { fetchOptions: { headers } }).toPromise()

  if (error) {
    throw error
  }

  const transactions = data?.transactions?.data ?? []
  const totalPages = data?.transactions?.paginatorInfo?.lastPage ?? 1

  return { transactions, totalPages }
})
