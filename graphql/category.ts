import { graphql } from '~/graphql'
import { TransactionFragment } from '~/graphql'

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

export const CategoriesQuery = graphql(
  `
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
  `,
  [CategoryFragment]
)

export const CategoriesWithTransactionsQuery = graphql(
  `
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
  `,
  [CategoryFragment, TransactionFragment]
)

export const CategoryCreateMutation = graphql(
  `
    mutation CategoryCreate($data: CreateCategoryInput!) {
      result: createCategory(data: $data) {
        ...CategoryFragment
      }
    }
  `,
  [CategoryFragment]
)

export const CategoryDeleteMutation = graphql(
  `
    mutation CategoryDelete($id: ID!) {
      result: deleteCategory(id: $id) {
        ...CategoryFragment
      }
    }
  `,
  [CategoryFragment]
)

export const CategoryTransactionsQuery = graphql(
  `
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
  `,
  [CategoryFragment, TransactionFragment]
)

export const CategoryUpdateMutation = graphql(
  `
    mutation CategoryUpdate($data: UpdateCategoryInput!) {
      result: updateCategory(data: $data) {
        ...CategoryFragment
      }
    }
  `,
  [CategoryFragment]
)
