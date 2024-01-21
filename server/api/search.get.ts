import { transactionsQuery } from '~/gql'
import { QueryTransactionsOrderByColumn, QueryTransactionsWhereColumn, SortOrder, SqlOperator } from '~/gen/gql/graphql'

import type { QueryTransactionsWhereWhereConditions, TransactionsQueryVariables } from '~/gen/gql/graphql'

export default defineEventHandler(async (event) => {
  const { client, headers } = event.context
  const query = getQuery(event)

  /* Find transactions by note content */

  const where: QueryTransactionsWhereWhereConditions = {
    OR: [
      {
        column: QueryTransactionsWhereColumn.Note,
        operator: SqlOperator.Like,
        value: `%${query.q}%`,
      },
    ],
  }

  /* If search query can be cast to number, find transactions by exact sum */

  if (!isNaN(Number(query.q)) && Array.isArray(where.OR)) {
    where.OR.push({
      column: QueryTransactionsWhereColumn.Sum,
      operator: SqlOperator.Eq,
      value: query.q,
    })
  }

  const variables: TransactionsQueryVariables = {
    first: Number(query.perPage) || 50,
    orderBy: [
      {
        column: QueryTransactionsOrderByColumn.CreatedAt,
        order: SortOrder.Desc,
      },
    ],
    page: Number(query.page) || 1,
    where,
  }

  const { data, error } = await client.query(transactionsQuery, variables, { fetchOptions: { headers } }).toPromise()

  if (error) throw error

  const transactions = data?.transactions?.data ?? []
  const totalPages = data?.transactions?.paginatorInfo?.lastPage ?? 1

  return { transactions, totalPages }
})
