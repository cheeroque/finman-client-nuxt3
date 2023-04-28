import { DateTime } from 'luxon'
import { defineStore } from 'pinia'
import { RecordsCategory, RecordsItem, RecordsSnapshot } from '~~/types/records'
import CATEGORIES_QUERY from '@/graphql/Categories.gql'
import FIRST_RECORD_QUERY from '@/graphql/FirstRecord.gql'
import RECORDS_QUERY from '@/graphql/Records.gql'
import RECORDS_TOTAL_QUERY from '@/graphql/RecordsTotal.gql'
import SNAPSHOTS_QUERY from '@/graphql/Snapshots.gql'
// import { FetchError } from 'ofetch'
// import { useAuthStore } from '~/store/auth'

interface MonthRecords {
  [key: string]: RecordsItem[]
}

interface RecordsState {
  balance: number
  categories: RecordsCategory[]
  firstRecord?: RecordsItem
  monthRecords?: MonthRecords
  pending: boolean
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

interface FirstRecordQueryResponse {
  records: FirstRecordQueryResponseRecords
}

interface FirstRecordQueryResponseRecords {
  data: RecordsItem[]
}

interface RecordsQueryResponse {
  records: RecordsQueryResponseRecords
}

interface RecordsQueryResponseRecords {
  data: RecordsItem[]
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
    firstRecord: undefined,
    monthRecords: undefined,
    pending: false,
    records: [],
    snapshot: undefined,
    totalPages: 0,
  }),

  actions: {
    async fetchBalance() {
      this.pending = true

      try {
        const { data } = await useAsyncQuery<RecordsTotalResponse>(RECORDS_TOTAL_QUERY)

        if (data.value) {
          const { expensesTotal, incomesTotal } = data.value
          this.balance = incomesTotal - expensesTotal
        }
      } catch (error) {}

      this.pending = false
    },

    async fetchCategories() {
      this.pending = true

      try {
        const { data } = await useAsyncQuery<CategoriesQueryResponse>(CATEGORIES_QUERY)

        if (data.value?.categories) {
          this.categories = data.value.categories.data
        }
      } catch (error) {}

      this.pending = false
    },

    async fetchFirstRecord() {
      this.pending = true

      try {
        const { data } = await useAsyncQuery<FirstRecordQueryResponse>(FIRST_RECORD_QUERY)

        if (data.value?.records) {
          this.firstRecord = data.value.records.data[0]
        }
      } catch (error) {}

      this.pending = false
    },

    async fetchMonthRecords() {
      this.pending = true

      const now = DateTime.now()
      /* 00:00:00, first day of current month */
      const from = now.set({ hour: 0, minute: 0, second: 0, day: 1 })
      /* 23:59:59, last day of current month */
      const to = from.plus({ month: 1 }).minus({ second: 1 })

      const variables = {
        where: {
          AND: [
            { column: 'CREATED_AT', operator: 'GTE', value: from.toFormat('yyyy-LL-dd HH:mm:ss') },
            { column: 'CREATED_AT', operator: 'LTE', value: to.toFormat('yyyy-LL-dd HH:mm:ss') },
          ],
        },
      }

      try {
        const { data } = await useAsyncQuery<RecordsQueryResponse>(RECORDS_QUERY, variables)

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
      } catch (error) {}

      this.pending = false
    },

    async fetchSnapshot() {
      this.pending = true

      const variables = { first: 1 }

      try {
        const { data } = await useAsyncQuery<SnapshotsQueryResponse>(SNAPSHOTS_QUERY, variables)

        if (data.value?.snapshots?.data) {
          this.snapshot = data.value.snapshots.data[0]
        }
      } catch (error) {}
    },

    async refetchOnRecordsChange() {
      try {
        await Promise.all([this.fetchBalance(), this.fetchMonthRecords()])
      } catch (error) {
        handleAuthError(error)
      }
    },
  },
})
