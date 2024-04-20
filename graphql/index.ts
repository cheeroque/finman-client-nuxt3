import { initGraphQLTada } from 'gql.tada'
import type { introspection } from '~/gen/graphql-env.d.ts'

export const graphql = initGraphQLTada<{
  introspection: introspection
  scalars: {
    JSON: {
      path: string
      size: number
    }
  }
}>()

export type { FragmentOf, ResultOf, VariablesOf } from 'gql.tada'
export { readFragment } from 'gql.tada'
