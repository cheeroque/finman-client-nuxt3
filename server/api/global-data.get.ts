import { categoriesQuery, recordsQuery, recordsTotalQuery } from '~/gql'
import { QueryRecordsOrderByColumn, SortOrder } from '~/gen/gql/graphql'

import type { RecordsQueryVariables } from '~/gen/gql/graphql'

export default defineEventHandler(async (event) => {
  const { client, headers } = event.context

  const variables: RecordsQueryVariables = {
    first: 1,
    orderBy: [
      {
        column: QueryRecordsOrderByColumn.CreatedAt,
        order: SortOrder.Asc,
      },
    ],
  }

  const [{ data: balanceData }, { data: categoriesData }, { data: firstRecordData }] = await Promise.all([
    client.query(recordsTotalQuery, {}, { fetchOptions: { headers } }).toPromise(),
    client.query(categoriesQuery, {}, { fetchOptions: { headers } }).toPromise(),
    client.query(recordsQuery, variables, { fetchOptions: { headers } }).toPromise(),
  ])

  const expensesTotal = Number(balanceData?.expensesTotal) || 0
  const incomesTotal = Number(balanceData?.incomesTotal) || 0

  const balance = incomesTotal - expensesTotal
  const categories = categoriesData?.categories?.data ?? []
  const firstRecord = firstRecordData?.records?.data?.[0]

  return { balance, categories, firstRecord }
})
