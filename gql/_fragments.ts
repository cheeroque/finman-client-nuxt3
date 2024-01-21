import { graphql } from '~/gen/gql'

export const CategoryFragment = graphql(`
  fragment CategoryFragment on Category {
    color
    id
    is_income
    name
    slug
  }
`)

export const TransactionFragment = graphql(`
  fragment TransactionFragment on Transaction {
    created_at
    id
    note
    sum
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
