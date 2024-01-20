import { graphql } from '~/gen/gql'

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
