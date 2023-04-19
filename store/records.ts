import { defineStore } from 'pinia'
// import { FetchError } from 'ofetch'
// import { useAuthStore } from '~/store/auth'

interface State {
  balance: number
  categories: RecordsCategory[] | []
  firstRecord: RecordsItem | {}
  monthRecords: { [key: string]: RecordsItem[] }
  pending: boolean
  records: RecordsItem[] | []
  snapshot?: RecordsSnapshot
  totalPages: number
}

async function handleAuthError(error: unknown) {
  // if (error instanceof FetchError && error.status === 401) {
  //   const authStore = useAuthStore()
  //   await authStore.logout()
  // }
}

export const useRecordsStore = defineStore({
  id: 'records',

  state: (): State => ({
    balance: 0,
    categories: [],
    firstRecord: {},
    monthRecords: {},
    pending: false,
    snapshot: undefined,
    records: [],
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
      try {
        const balance = (await useApiFetch('/api/data/total', { method: 'GET' })) as number
        this.balance = balance ?? 0
      } catch (error) {
        handleAuthError(error)
      }
    },

    async fetchCategories() {
      try {
        const categories = (await useApiFetch('/api/data/categories', { method: 'GET' })) as RecordsCategory[]
        this.categories = categories || []
      } catch (error) {
        handleAuthError(error)
      }
    },

    async fetchFirstRecord() {
      try {
        const firstRecord = (await useApiFetch('/api/data/records/first', { method: 'GET' })) as RecordsItem
        this.firstRecord = firstRecord || {}
      } catch (error) {
        handleAuthError(error)
      }
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
