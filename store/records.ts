import { useQuery } from '@urql/vue'
import { defineStore } from 'pinia'

import SNAPSHOTS_QUERY from '~/graphql/Snapshots.gql'

import type { RecordsCategory, RecordsItem, RecordsSnapshot } from '~/types/records'

interface MonthRecords {
  [key: string]: RecordsItem[]
}

interface SnapshotsQueryResponse {
  snapshots: {
    data: RecordsSnapshot[]
    paginatorInfo: PaginatorInfo
  }
}

export const useRecordsStore = defineStore('records', () => {
  /* Store state */

  const balance = ref<number>(0)
  const categories = ref<RecordsCategory[]>([])
  const firstRecord = ref<RecordsItem>()
  const monthRecords = ref<MonthRecords>()
  const pending = ref<number>(0)
  const records = ref<RecordsItem[]>([])
  const snapshot = ref<RecordsSnapshot>()
  const totalPages = ref<number>(1)

  /* Store getters */

  const loading = computed(() => Boolean(pending.value))

  /* All queries are declared below, before being used inside actions,
   * because useQuery composable only works inside store context */

  /* Latest snapshot query, displayed in NavDrawerSnapshot component */
  const snapshotsQuery = useQuery<SnapshotsQueryResponse>({ query: SNAPSHOTS_QUERY })

  /* Store actions */

  async function fetchSnapshot() {
    pending.value++

    const variables = { first: 1 }

    const { data } = await snapshotsQuery.executeQuery({ variables })

    snapshot.value = data.value?.snapshots.data?.[0]

    pending.value--
  }

  return {
    balance,
    categories,
    fetchSnapshot,
    firstRecord,
    loading,
    monthRecords,
    pending,
    records,
    snapshot,
    totalPages,
  }
})
