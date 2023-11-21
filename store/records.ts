/* TODO: fix same records query not working with different variables
 * Variables do not seem to be applied at all */

import { useQuery } from '@urql/vue'
import { DateTime } from 'luxon'
import { defineStore } from 'pinia'

import CATEGORIES_QUERY from '~/graphql/Categories.gql'
import RECORDS_QUERY from '~/graphql/Records.gql'
import RECORDS_TOTAL_QUERY from '~/graphql/RecordsTotal.gql'
import SNAPSHOTS_QUERY from '~/graphql/Snapshots.gql'

import type {
  RecordsCategory,
  RecordsItem,
  RecordsQueryResponse,
  RecordsQueryVariables,
  RecordsSnapshot,
} from '~/types/records'

interface RecordsState {
  balance: number
  categories: RecordsCategory[]
  error?: string
  firstRecord?: RecordsItem
  monthRecords?: MonthRecords
  pending: number
  records: RecordsItem[]
  snapshot?: RecordsSnapshot
  totalPages: number
}

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
  /* Initialize state */

  const balance = ref<number>(0)
  const categories = ref<RecordsCategory[]>([])
  const error = ref<string>()
  const firstRecord = ref<RecordsItem>()
  const monthRecords = ref<MonthRecords>()
  const pending = ref<number>(0)
  const records = ref<RecordsItem[]>([])
  const snapshot = ref<RecordsSnapshot>()
  const totalPages = ref<number>(1)

  /* Declare queries and composables */

  const route = useRoute()

  const balanceQuery = useQuery<RecordsTotalResponse>({ query: RECORDS_TOTAL_QUERY })
  const categoriesQuery = useQuery<CategoriesQueryResponse>({ query: CATEGORIES_QUERY })
  const firstRecordQuery = useQuery<RecordsQueryResponse>({ query: RECORDS_QUERY })
  const recordsQuery = useQuery<RecordsQueryResponse>({ query: RECORDS_QUERY })
  const snapshotsQuery = useQuery<SnapshotsQueryResponse>({ query: SNAPSHOTS_QUERY })

  /* Getters */

  const loading = computed(() => Boolean(pending.value))

  const firstRecordVariables = computed(() => ({
    first: 1,
    orderBy: [{ column: 'CREATED_AT', order: 'ASC' }],
  }))

  /* Actions */

  async function fetchBalance() {
    const { data } = await balanceQuery.executeQuery()

    if (data.value) {
      const { expensesTotal, incomesTotal } = data.value
      balance.value = incomesTotal - expensesTotal
    }
  }

  async function fetchCategories() {
    const { data } = await categoriesQuery.executeQuery()

    if (data.value) {
      categories.value = data.value.categories.data
    }
  }

  async function fetchFirstRecord() {
    const { data } = await firstRecordQuery.executeQuery({ variables: firstRecordVariables })

    firstRecord.value = data.value?.records.data?.[0]
  }

  async function fetchMonthRecords() {
    const now = DateTime.now()

    /* 00:00:00, first day of current month */
    const from = now.set({ hour: 0, minute: 0, second: 0, day: 1 })

    /* 23:59:59, last day of current month */
    const to = from.plus({ month: 1 }).minus({ second: 1 })

    const variables = {
      first: 1000,
      where: {
        AND: [
          { column: 'CREATED_AT', operator: 'GTE', value: from.toFormat('yyyy-LL-dd HH:mm:ss') },
          { column: 'CREATED_AT', operator: 'LTE', value: to.toFormat('yyyy-LL-dd HH:mm:ss') },
        ],
      },
    }

    const { data } = await recordsQuery.executeQuery({ variables, requestPolicy: 'network-only' })

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
  }

  async function fetchRecords() {
    const viewMode = route.params.view as ViewMode

    /** Build query variables */
    const column = route.query.orderBy ? String(route.query.orderBy) : 'CREATED_AT'
    const order = route.query.order ? String(route.query.order) : 'DESC'
    const first = Number(route.query.perPage) || 50
    const page = Number(route.query.page) || 1

    /** Set filter by is_income if needed */
    const isExpense = viewMode === 'expense'
    const isIncome = viewMode === 'income'

    const hasCategory =
      isExpense || isIncome
        ? {
            column: 'IS_INCOME',
            operator: 'EQ',
            value: isIncome,
          }
        : undefined

    const variables = {
      first,
      hasCategory,
      orderBy: [{ column, order }],
      page,
    }

    const { data } = await recordsQuery.executeQuery({ variables, requestPolicy: 'network-only' })

    records.value = data.value?.records.data ?? []
    totalPages.value = data.value?.records.paginatorInfo?.lastPage ?? 1
  }

  async function fetchSnapshot() {
    const variables = { first: 1 }

    const { data } = await snapshotsQuery.executeQuery({ variables })

    snapshot.value = data.value?.snapshots.data?.[0]
  }

  return {
    balance,
    categories,
    error,
    fetchBalance,
    fetchCategories,
    fetchFirstRecord,
    fetchMonthRecords,
    fetchRecords,
    fetchRecordsDirect: recordsQuery.executeQuery,
    fetchSnapshot,
    firstRecord,
    firstRecordVariables,
    loading,
    monthRecords,
    pending,
    records,
    snapshot,
    totalPages,
  }
})
