import { useQuery } from '@urql/vue'
import { DateTime } from 'luxon'
import { defineStore } from 'pinia'

import CATEGORIES_QUERY from '~/graphql/Categories.gql'
import RECORDS_QUERY from '~/graphql/Records.gql'
import RECORDS_TOTAL_QUERY from '~/graphql/RecordsTotal.gql'
import SNAPSHOTS_QUERY from '~/graphql/Snapshots.gql'

import type { RecordsCategory, RecordsItem, RecordsQueryResponse, RecordsSnapshot } from '~/types/records'

interface MonthRecords {
  [key: string]: RecordsItem[]
}

interface CategoriesQueryResponse {
  categories: {
    data: RecordsCategory[]
    paginatorInfo: PaginatorInfo
  }
}

interface RecordsTotalResponse {
  expensesTotal: number
  incomesTotal: number
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

  /* Total balance query */
  const balanceQuery = useQuery<RecordsTotalResponse>({ query: RECORDS_TOTAL_QUERY })

  /* Record categories query */
  const categoriesQuery = useQuery<CategoriesQueryResponse>({ query: CATEGORIES_QUERY })

  /* First record query (to start SidebarCalendar months from) */
  const firstRecordQuery = useQuery<RecordsQueryResponse>({
    query: RECORDS_QUERY,
    variables: {
      first: 1,
      orderBy: [{ column: 'CREATED_AT', order: 'ASC' }],
    },
  })

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

  async function fetchBalance() {
    pending.value++

    const { data } = await balanceQuery.executeQuery()

    if (data.value) {
      const { expensesTotal, incomesTotal } = data.value
      balance.value = incomesTotal - expensesTotal
    }

    pending.value--
  }

  async function fetchCategories() {
    pending.value++

    const { data } = await categoriesQuery.executeQuery()

    if (data.value) {
      categories.value = data.value.categories.data
    }

    pending.value--
  }

  async function fetchFirstRecord() {
    pending.value++

    const { data } = await firstRecordQuery.executeQuery()

    firstRecord.value = data.value?.records.data?.[0]

    pending.value--
  }

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
    fetchBalance,
    fetchCategories,
    fetchFirstRecord,
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
