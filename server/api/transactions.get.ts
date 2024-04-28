import { TransactionsQuery } from '~/graphql'
import type { VariablesOf } from '~/graphql'

export default defineEventHandler(async (event) => {
  const { client, headers } = event.context
  const query = getQuery(event)

  const variables: VariablesOf<typeof TransactionsQuery> = {
    first: Number(query.perPage) || 50,
    orderBy: [{ column: 'CREATED_AT', order: 'DESC' }],
    page: Number(query.page) || 1,
  }

  if (['expense', 'income'].includes(String(query.view))) {
    variables.hasCategory = {
      column: 'IS_INCOME',
      operator: 'EQ',
      value: query.view === 'income',
    }
  }

  const { data, error } = await client.query(TransactionsQuery, variables, { fetchOptions: { headers } }).toPromise()

  if (error) {
    throw error
  }

  const transactions = data?.transactions?.data ?? []
  const totalPages = data?.transactions?.paginatorInfo?.lastPage ?? 1

  return { transactions, totalPages }
})
