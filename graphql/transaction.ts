import { graphql } from '~/graphql'
import { CategoryFragment } from '~/graphql'

export const TransactionFragment = graphql(`
  fragment TransactionFragment on Transaction {
    created_at
    id
    note
    sum
    updated_at
  }
`)

export const TransactionCreateMutation = graphql(
  `
    mutation TransactionCreate($data: CreateTransactionInput!) {
      result: createTransaction(data: $data) {
        ...TransactionFragment
      }
    }
  `,
  [TransactionFragment]
)

export const TransactionDeleteMutation = graphql(
  `
    mutation TransactionDelete($id: ID!) {
      result: deleteTransaction(id: $id) {
        ...TransactionFragment
      }
    }
  `,
  [TransactionFragment]
)

export const TransactionUpdateMutation = graphql(
  `
    mutation TransactionUpdate($data: UpdateTransactionInput!) {
      result: updateTransaction(data: $data) {
        ...TransactionFragment
      }
    }
  `,
  [TransactionFragment]
)

export const TransactionsExportMutation = graphql(`
  mutation TransactionsExport {
    result: exportTransactions {
      file
    }
  }
`)

export const TransactionsQuery = graphql(
  `
    query Transactions(
      $first: Int = 50
      $page: Int = 1
      $hasCategory: QueryTransactionsHasCategoryWhereHasConditions = {}
      $orderBy: [QueryTransactionsOrderByOrderByClause!] = [{ column: CREATED_AT, order: DESC }]
      $where: QueryTransactionsWhereWhereConditions = {}
    ) {
      transactions(first: $first, page: $page, orderBy: $orderBy, hasCategory: $hasCategory, where: $where) {
        data {
          ...TransactionFragment

          category {
            ...CategoryFragment
          }
        }

        paginatorInfo {
          lastPage
          total
        }
      }
    }
  `,
  [CategoryFragment, TransactionFragment]
)

export const TransactionsTotalQuery = graphql(`
  query TransactionsTotal {
    expensesTotal: transactionsAggregate(hasCategory: { column: IS_INCOME, operator: EQ, value: "0" })
    incomesTotal: transactionsAggregate(hasCategory: { column: IS_INCOME, operator: EQ, value: "1" })
  }
`)
