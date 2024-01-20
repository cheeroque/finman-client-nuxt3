import { graphql } from '~/gen/gql'

export const categoriesQuery = graphql(`
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
`)
