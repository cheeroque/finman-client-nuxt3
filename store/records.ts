import { defineStore } from 'pinia'
import { RecordsCategory, RecordsItem, RecordsSnapshot } from '~~/types/records'
import CATEGORIES_QUERY from '@/graphql/Categories.gql'
import FIRST_RECORD_QUERY from '@/graphql/FirstRecord.gql'
import RECORDS_TOTAL_QUERY from '@/graphql/RecordsTotal.gql'
// import { FetchError } from 'ofetch'
// import { useAuthStore } from '~/store/auth'

interface RecordsState {
  balance: number
  categories: RecordsCategory[]
  firstRecord?: RecordsItem
  monthRecords?: { [key: string]: RecordsItem[] }
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

interface RecordsTotalResponse {
  expensesTotal: number
  incomesTotal: number
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
    // async fetchRecordsData() {
    //   const route = useRoute()
    //   const viewMode = route.params.view as ViewMode
    //   const query: RecordsRequestParams = {
    //     order: (route.query.order as string) || 'DESC',
    //     orderBy: (route.query.orderBy as string) || 'created_at',
    //     page: Number(route.query.page) || 1,
    //     perPage: Number(route.query.perPage) || 50,
    //     show: viewMode || null,
    //   }

    //   this.pending = true

    //   const recordsData = (await useApiFetch('/api/data/records', { method: 'GET', query })) as RecordsResponse

    //   this.records = recordsData.data || []
    //   this.totalPages = recordsData.last_page || 0
    //   this.pending = false
    // },

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
      try {
        const date = new Date()
        const y = date.getFullYear()
        const m = date.getMonth() + 1
        const monthRecords = (await useApiFetch(`/api/data/month/${y}-${m}`, {
          method: 'GET',
        })) as { [key: string]: RecordsItem[] }
        this.monthRecords = monthRecords || {}
      } catch (error) {
        handleAuthError(error)
      }
    },

    async fetchSnapshot() {
      try {
        const snapshot = (await useApiFetch('/api/data/revises/latest', { method: 'GET' })) as RecordsSnapshot
        this.snapshot = snapshot || {}
      } catch (error) {
        handleAuthError(error)
      }
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
