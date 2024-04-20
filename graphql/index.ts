/* Initialize gql.tada */

import { initGraphQLTada } from 'gql.tada'
import type { introspection } from '~/gen/graphql-env.d.ts'

export const graphql = initGraphQLTada<{
  introspection: introspection
  scalars: {
    DateTime: string
    JSON: {
      path: string
      size: number
    }
  }
}>()

export type { FragmentOf, ResultOf, VariablesOf } from 'gql.tada'
export { readFragment, maskFragments } from 'gql.tada'

/* Fragments */

export const CategoryFragment = graphql(`
  fragment CategoryFragment on Category {
    color
    created_at
    id
    is_income
    name
    slug
    updated_at
  }
`)

export const SnapshotFragment = graphql(`
  fragment SnapshotFragment on Revise {
    balance
    created_at
    id
    note
  }
`)

export const TransactionFragment = graphql(`
  fragment TransactionFragment on Transaction {
    created_at
    id
    note
    sum
    updated_at
  }
`)

export const UserFragment = graphql(`
  fragment UserFragment on User {
    created_at
    email
    email_verified_at
    id
    name
    updated_at
  }
`)

/* Queries */

export const CategoriesQuery = graphql(
  `
    query Categories {
      categories {
        data {
          ...CategoryFragment
        }

        paginatorInfo {
          total
        }
      }
    }
  `,
  [CategoryFragment]
)

export const CategoriesWithTransactionsQuery = graphql(
  `
    query CategoriesWithTransactions(
      $where: CategoryTransactionsWhereWhereConditions = {}
      $whereTotal: CategoryTransactionsTotalWhereWhereConditions = {}
    ) {
      categories(orderBy: [{ column: IS_INCOME, order: ASC }]) {
        data {
          ...CategoryFragment

          transactions(orderBy: [{ column: CREATED_AT, order: DESC }], where: $where) {
            ...TransactionFragment

            category {
              ...CategoryFragment
            }
          }

          transactionsTotal(where: $whereTotal)
        }
      }
    }
  `,
  [CategoryFragment, TransactionFragment]
)

export const CategoryTransactionsQuery = graphql(
  `
    query CategoryTransactions($slug: String!, $first: Int = 18, $page: Int = 1) {
      transactions: transactionsByPeriod(slug: $slug, first: $first, page: $page) {
        data {
          period
          transactions {
            ...TransactionFragment

            category {
              ...CategoryFragment
            }
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

export const MeQuery = graphql(
  `
    query Me {
      me {
        ...UserFragment
      }
    }
  `,
  [UserFragment]
)

export const SnapshotsQuery = graphql(
  `
    query Snapshots(
      $first: Int
      $orderBy: [QueryRevisesOrderByOrderByClause!] = [{ column: CREATED_AT, order: DESC }]
    ) {
      snapshots: revises(first: $first, orderBy: $orderBy) {
        data {
          ...SnapshotFragment
        }

        paginatorInfo {
          total
          lastPage
        }
      }
    }
  `,
  [SnapshotFragment]
)

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

/* Mutations */

export const CategoryCreateMutation = graphql(
  `
    mutation CategoryCreate($data: CreateCategoryInput!) {
      result: createCategory(data: $data) {
        ...CategoryFragment
      }
    }
  `,
  [CategoryFragment]
)

export const CategoryDeleteMutation = graphql(
  `
    mutation CategoryDelete($id: ID!) {
      result: deleteCategory(id: $id) {
        ...CategoryFragment
      }
    }
  `,
  [CategoryFragment]
)

export const CategoryUpdateMutation = graphql(
  `
    mutation CategoryUpdate($data: UpdateCategoryInput!) {
      result: updateCategory(data: $data) {
        ...CategoryFragment
      }
    }
  `,
  [CategoryFragment]
)

export const LoginMutation = graphql(
  `
    mutation Login($password: String!, $username: String!) {
      login(input: { username: $username, password: $password }) {
        access_token

        user {
          ...UserFragment
        }
      }
    }
  `,
  [UserFragment]
)

export const LogoutMutation = graphql(`
  mutation Logout {
    logout {
      message
      status
    }
  }
`)

export const SnapshotCreateMutation = graphql(
  `
    mutation SnapshotCreate($data: CreateReviseInput!) {
      result: createRevise(data: $data) {
        ...SnapshotFragment
      }
    }
  `,
  [SnapshotFragment]
)

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
