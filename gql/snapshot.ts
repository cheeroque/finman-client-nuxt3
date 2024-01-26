import { graphql } from '~/gen/gql'

export const snapshotsQuery = graphql(`
  query Snapshots($first: Int, $orderBy: [QueryRevisesOrderByOrderByClause!] = [{ column: CREATED_AT, order: DESC }]) {
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
`)

export const snapshotCreateMutation = graphql(`
  mutation SnapshotCreate($data: CreateReviseInput!) {
    result: createRevise(data: $data) {
      ...SnapshotFragment
    }
  }
`)
