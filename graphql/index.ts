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

export { UserFragment, LoginMutation, LogoutMutation, MeQuery } from './auth'
export {
  CategoryFragment,
  CategoriesQuery,
  CategoriesWithTransactionsQuery,
  CategoryCreateMutation,
  CategoryDeleteMutation,
  CategoryTransactionsQuery,
  CategoryUpdateMutation,
} from './category'
export { SnapshotFragment, SnapshotCreateMutation, SnapshotsQuery } from './snapshot'
export {
  TransactionFragment,
  TransactionCreateMutation,
  TransactionDeleteMutation,
  TransactionUpdateMutation,
  TransactionsExportMutation,
  TransactionsQuery,
  TransactionsTotalQuery,
} from './transaction'
