import { graphql } from '~/gen/gql'

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
