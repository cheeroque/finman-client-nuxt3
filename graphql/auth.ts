import { graphql } from '~/graphql'

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
