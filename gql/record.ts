import { graphql } from '~/gen/gql'

export const recordsQuery = graphql(`
  query Records(
    $first: Int = 50
    $page: Int = 1
    $hasCategory: QueryRecordsHasCategoryWhereHasConditions = {}
    $orderBy: [QueryRecordsOrderByOrderByClause!] = [{ column: CREATED_AT, order: DESC }]
    $where: QueryRecordsWhereWhereConditions = {}
  ) {
    records(first: $first, page: $page, orderBy: $orderBy, hasCategory: $hasCategory, where: $where) {
      data {
        ...RecordFragment

        category {
          ...CategoryFragment
        }
      }

      paginatorInfo {
        lastPage
        total
      }
    }
  }
`)

export const recordsTotalQuery = graphql(`
  query RecordsTotal {
    expensesTotal: recordsAggregate(hasCategory: { column: IS_INCOME, operator: EQ, value: "0" })
    incomesTotal: recordsAggregate(hasCategory: { column: IS_INCOME, operator: EQ, value: "1" })
  }
`)
