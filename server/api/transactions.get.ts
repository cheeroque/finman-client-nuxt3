import { transactionsQuery } from '~/gql'
import {
  QueryTransactionsHasCategoryColumn,
  QueryTransactionsOrderByColumn,
  SortOrder,
  SqlOperator,
} from '~/gen/gql/graphql'

import type { TransactionsQueryVariables } from '~/gen/gql/graphql'

export default defineEventHandler(async (event) => {
  const { client, headers } = event.context
  const query = getQuery(event)

  const variables: TransactionsQueryVariables = {
    first: Number(query.perPage) || 50,
    orderBy: [
      {
        column: QueryTransactionsOrderByColumn.CreatedAt,
        order: SortOrder.Desc,
      },
    ],
    page: Number(query.page) || 1,
  }

  if (['expense', 'income'].includes(String(query.view))) {
    variables.hasCategory = {
      column: QueryTransactionsHasCategoryColumn.IsIncome,
      operator: SqlOperator.Eq,
      value: query.view === 'income',
    }
  }

  const { data, error } = await client.query(transactionsQuery, variables, { fetchOptions: { headers } }).toPromise()

  if (error) throw error

  const transactions = data?.transactions?.data ?? []
  const totalPages = data?.transactions?.paginatorInfo?.lastPage ?? 1

  return { transactions, totalPages }
})
