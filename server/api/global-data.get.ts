import { CategoriesQuery, TransactionsQuery, TransactionsTotalQuery } from '~/graphql'
import type { VariablesOf } from '~/graphql'

export default defineEventHandler(async (event) => {
  const { client, headers } = event.context

  const variables: VariablesOf<typeof TransactionsQuery> = {
    first: 1,
    orderBy: [{ column: 'CREATED_AT', order: 'ASC' }],
  }

  const [balanceResponse, categoriesResponse, firstTransactionResponse] = await Promise.all([
    client.query(TransactionsTotalQuery, {}, { fetchOptions: { headers } }).toPromise(),
    client.query(CategoriesQuery, {}, { fetchOptions: { headers } }).toPromise(),
    client.query(TransactionsQuery, variables, { fetchOptions: { headers } }).toPromise(),
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
