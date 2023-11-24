import { useQuery } from '@urql/vue'
import { DateTime } from 'luxon'
import { defineStore } from 'pinia'

import RECORDS_QUERY from '~/graphql/Records.gql'
import SNAPSHOTS_QUERY from '~/graphql/Snapshots.gql'

import type { RecordsCategory, RecordsItem, RecordsQueryResponse, RecordsSnapshot } from '~/types/records'

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

  /* Query for records made from the start of the current month util its end,
   * displayed in SidebarMonthly component */
  const now = DateTime.now()

  const from = now.set({ hour: 0, minute: 0, second: 0, day: 1 })
  const to = from.plus({ month: 1 }).minus({ second: 1 })

  const monthRecordsQuery = useQuery<RecordsQueryResponse>({
    query: RECORDS_QUERY,
    variables: {
      first: 1000,
      where: {
        AND: [
          { column: 'CREATED_AT', operator: 'GTE', value: from.toFormat('yyyy-LL-dd HH:mm:ss') },
          { column: 'CREATED_AT', operator: 'LTE', value: to.toFormat('yyyy-LL-dd HH:mm:ss') },
        ],
      },
    },
  })

  /* Latest snapshot query, displayed in NavDrawerSnapshot component */
  const snapshotsQuery = useQuery<SnapshotsQueryResponse>({ query: SNAPSHOTS_QUERY })

  /* Store actions */

  async function fetchMonthRecords() {
    pending.value++

    const { data } = await monthRecordsQuery.executeQuery()

    if (data.value?.records.data) {
      /* Group records by category id */
      monthRecords.value = data.value.records.data.reduce((acc: MonthRecords, cur) => {
        const categoryId = String(cur.category?.id)

        if (categoryId) {
          acc[categoryId] = acc[categoryId] ?? []
          acc[categoryId].push(cur)
        }

        return acc
      }, {})
    }

    pending.value--
  }

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
    fetchMonthRecords,
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
