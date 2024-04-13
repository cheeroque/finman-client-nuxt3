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

export const categoryTransactionsQuery = graphql(`
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
`)

export const categoryCreateMutation = graphql(`
  mutation CategoryCreate($data: CreateCategoryInput!) {
    result: createCategory(data: $data) {
      ...CategoryFragment
    }
  }
`)

export const categoryDeleteMutation = graphql(`
  mutation CategoryDelete($id: ID!) {
    result: deleteCategory(id: $id) {
      ...CategoryFragment
    }
  }
`)

export const categoryUpdateMutation = graphql(`
  mutation CategoryUpdate($data: UpdateCategoryInput!) {
    result: updateCategory(data: $data) {
      ...CategoryFragment
    }
  }
`)
