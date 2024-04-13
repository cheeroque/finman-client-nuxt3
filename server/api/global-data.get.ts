import { categoriesQuery, transactionsQuery, transactionsTotalQuery } from '~/gql'
import { QueryTransactionsOrderByColumn, SortOrder } from '~/gen/gql/graphql'

import type { TransactionsQueryVariables } from '~/gen/gql/graphql'

export default defineEventHandler(async (event) => {
  const { client, headers } = event.context

  const variables: TransactionsQueryVariables = {
    first: 1,
    orderBy: [
      {
        column: QueryTransactionsOrderByColumn.CreatedAt,
        order: SortOrder.Asc,
      },
    ],
  }

  const [balanceResponse, categoriesResponse, firstTransactionResponse] = await Promise.all([
    client.query(transactionsTotalQuery, {}, { fetchOptions: { headers } }).toPromise(),
    client.query(categoriesQuery, {}, { fetchOptions: { headers } }).toPromise(),
    client.query(transactionsQuery, variables, { fetchOptions: { headers } }).toPromise(),
  ])

  if (balanceResponse.error || categoriesResponse.error || firstTransactionResponse.error) {
    throw createError({
      message: 'Could not fetch global data',
      statusCode: 500,
    })
  }

  const expensesTotal = Number(balanceResponse.data?.expensesTotal) || 0
  const incomesTotal = Number(balanceResponse.data?.incomesTotal) || 0

  const balance = incomesTotal - expensesTotal
  const categories = categoriesResponse.data?.categories?.data ?? []
  const firstTransaction = firstTransactionResponse.data?.transactions?.data?.[0]

  return { balance, categories, firstTransaction }
})
