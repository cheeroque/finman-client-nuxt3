import { graphql } from '~/gen/gql'

export const loginMutation = graphql(`
  mutation Login($password: String!, $username: String!) {
    login(input: { username: $username, password: $password }) {
      access_token

      user {
        ...UserFragment
      }
    }
  }
`)

export const logoutMutation = graphql(`
  mutation Logout {
    logout {
      message
      status
    }
  }
`)

export const meQuery = graphql(`
  query Me {
    me {
      ...UserFragment
    }
  }
`)
