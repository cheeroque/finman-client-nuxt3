import { DateTime } from 'luxon'
import { defineStore } from 'pinia'
import {
  RecordsCategory,
  RecordsItem,
  RecordsQueryResponse,
  RecordsQueryVariables,
  RecordsSnapshot,
} from '~~/types/records'

import CATEGORIES_QUERY from '@/graphql/Categories.gql'
import RECORDS_QUERY from '@/graphql/Records.gql'
import RECORDS_TOTAL_QUERY from '@/graphql/RecordsTotal.gql'
import SNAPSHOTS_QUERY from '@/graphql/Snapshots.gql'

interface MonthRecords {
  [key: string]: RecordsItem[]
}

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

interface CategoriesQueryResponse {
  categories: CategoriesQueryResponseCategories
}

interface CategoriesQueryResponseCategories {
  data: RecordsCategory[]
  paginatorInfo: PaginatorInfo
}

interface RecordsTotalResponse {
  expensesTotal: number
  incomesTotal: number
}

interface SnapshotsQueryResponse {
  snapshots: SnapshotsQueryResponseSnapshots
}

interface SnapshotsQueryResponseSnapshots {
  data: RecordsSnapshot[]
  paginatorInfo: PaginatorInfo
}

export const useRecordsStore = defineStore({
  id: 'records',

  state: (): RecordsState => ({
    balance: 0,
    categories: [],
    error: undefined,
    firstRecord: undefined,
    monthRecords: undefined,
    pending: 0,
    records: [],
    snapshot: undefined,
    totalPages: 0,
  }),

  getters: {
    loading: (state) => Boolean(state.pending),
  },

  actions: {
    async fetchBalance() {
      this.pending++

      try {
        const { data, error } = await useAsyncQuery<RecordsTotalResponse>(RECORDS_TOTAL_QUERY)

        if (error.value) throw error.value

        if (data.value) {
          const { expensesTotal, incomesTotal } = data.value
          this.balance = incomesTotal - expensesTotal
        }
      } catch (error) {
        this.handleError(error)
      }

      this.pending--
    },

    async fetchCategories() {
      this.pending++

      try {
        const { data, error } = await useAsyncQuery<CategoriesQueryResponse>(CATEGORIES_QUERY)

        if (error.value) throw error.value

        if (data.value?.categories) {
          this.categories = data.value.categories.data
        }
      } catch (error) {
        this.handleError(error)
      }

      this.pending--
    },

    async fetchFirstRecord() {
      this.pending++

      const variables = {
        first: 1,
        orderBy: [{ column: 'CREATED_AT', order: 'ASC' }],
      }

      try {
        const { data, error } = await useAsyncQuery<RecordsQueryResponse>(RECORDS_QUERY, variables)

        if (error.value) throw error.value

        if (data.value?.records) {
          this.firstRecord = data.value.records.data[0]
        }
      } catch (error) {
        this.handleError(error)
      }

      this.pending--
    },

    async fetchMonthRecords() {
      this.pending++

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

      try {
        const { data, error } = await useAsyncQuery<RecordsQueryResponse>(RECORDS_QUERY, variables)

        if (error.value) throw error.value

        if (data.value?.records?.data) {
          /* Group records by category id */
          this.monthRecords = data.value.records.data.reduce((acc: MonthRecords, cur) => {
            const categoryId: string = String(cur.category?.id)

            if (categoryId) {
              acc[categoryId] = acc[categoryId] ?? []
              acc[categoryId].push(cur)
            }

            return acc
          }, {})
        }
      } catch (error) {
        this.handleError(error)
      }

      this.pending--
    },

    async fetchRecords() {
      this.pending++

      const route = useRoute()
      const viewMode = route.params.view as ViewMode

      /** Build query variables */
      const column = (route.query.orderBy as string) ?? 'CREATED_AT'
      const order = (route.query.order as string) ?? 'DESC'
      const first = Number(route.query.perPage) || 50
      const page = Number(route.query.page) || 1

      const variables: RecordsQueryVariables = {
        first,
        orderBy: [{ column, order }],
        page,
      }

      /** Set filter by is_income if needed */
      const isExpense = viewMode === 'expense'
      const isIncome = viewMode === 'income'

      if (isExpense || isIncome) {
        variables.hasCategory = {
          column: 'IS_INCOME',
          operator: 'EQ',
          value: isIncome,
        }
      }

      /** Fetch records */
      try {
        const { data, error } = await useAsyncQuery<RecordsQueryResponse>(RECORDS_QUERY, variables)

        if (error.value) throw error.value

        if (data.value?.records?.data) {
          this.records = data.value.records.data
          this.totalPages = data.value.records.paginatorInfo?.lastPage ?? 1
        }
      } catch (error) {
        this.handleError(error)
      }

      this.pending--
    },

    async fetchSnapshot() {
      this.pending++

      const variables = { first: 1 }

      try {
        const { data, error } = await useAsyncQuery<SnapshotsQueryResponse>(SNAPSHOTS_QUERY, variables)

        if (error.value) throw error.value

        if (data.value?.snapshots?.data) {
          this.snapshot = data.value.snapshots.data[0]
        }
      } catch (error) {
        this.handleError(error)
      }

      this.pending--
    },

    handleError(error: any) {
      const { $auth } = useNuxtApp()

      const isAuthError = error?.message === 'Unauthenticated.'

      if (isAuthError) {
        this.error = useString('errorMessageAuth')

        $auth.reset()

        const router = useRouter()
        router.replace('/login')
      } else {
        this.error = typeof error?.toJSON === 'function' ? error.toJSON() : useString('errorMessage')
      }
    },
  },
})
