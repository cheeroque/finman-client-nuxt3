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

export const categoriesWithTransactionsQuery = graphql(`
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
`)
