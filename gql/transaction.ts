import { graphql } from '~/gen/gql'

export const transactionsQuery = graphql(`
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
`)

export const transactionsTotalQuery = graphql(`
  query TransactionsTotal {
    expensesTotal: transactionsAggregate(hasCategory: { column: IS_INCOME, operator: EQ, value: "0" })
    incomesTotal: transactionsAggregate(hasCategory: { column: IS_INCOME, operator: EQ, value: "1" })
  }
`)

export const transactionCreateMutation = graphql(`
  mutation TransactionCreate($data: CreateTransactionInput!) {
    result: createTransaction(data: $data) {
      ...TransactionFragment
    }
  }
`)

export const transactionDeleteMutation = graphql(`
  mutation TransactionDelete($id: ID!) {
    result: deleteTransaction(id: $id) {
      ...TransactionFragment
    }
  }
`)

export const transactionUpdateMutation = graphql(`
  mutation TransactionUpdate($data: UpdateTransactionInput!) {
    result: updateTransaction(data: $data) {
      ...TransactionFragment
    }
  }
`)
