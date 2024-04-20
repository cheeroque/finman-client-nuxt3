import { graphql } from '~/graphql'

export const SnapshotFragment = graphql(`
  fragment SnapshotFragment on Revise {
    balance
    created_at
    id
    note
  }
`)

export const SnapshotCreateMutation = graphql(
  `
    mutation SnapshotCreate($data: CreateReviseInput!) {
      result: createRevise(data: $data) {
        ...SnapshotFragment
      }
    }
  `,
  [SnapshotFragment]
)

export const SnapshotsQuery = graphql(
  `
    query Snapshots(
      $first: Int
      $orderBy: [QueryRevisesOrderByOrderByClause!] = [{ column: CREATED_AT, order: DESC }]
    ) {
      snapshots: revises(first: $first, orderBy: $orderBy) {
        data {
          ...SnapshotFragment
        }

        paginatorInfo {
          total
          lastPage
        }
      }
    }
  `,
  [SnapshotFragment]
)
