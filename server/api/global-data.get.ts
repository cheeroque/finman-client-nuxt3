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

  const [{ data: balanceData }, { data: categoriesData }, { data: firstTransactionData }] = await Promise.all([
    client.query(transactionsTotalQuery, {}, { fetchOptions: { headers } }).toPromise(),
    client.query(categoriesQuery, {}, { fetchOptions: { headers } }).toPromise(),
    client.query(transactionsQuery, variables, { fetchOptions: { headers } }).toPromise(),
  ])

  const expensesTotal = Number(balanceData?.expensesTotal) || 0
  const incomesTotal = Number(balanceData?.incomesTotal) || 0

  const balance = incomesTotal - expensesTotal
  const categories = categoriesData?.categories?.data ?? []
  const firstTransaction = firstTransactionData?.transactions?.data?.[0]

  return { balance, categories, firstTransaction }
})
