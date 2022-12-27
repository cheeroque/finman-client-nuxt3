import { defineStore } from 'pinia'

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

function handleAuthError(error: Error) {
  console.log('[error caught in records store]', error)
  const { signOut } = useSession()
  signOut({ callbackUrl: '/auth/login' })
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
    async fetchRecordsData() {
      try {
        const route = useRoute()
        const viewMode = route.params.view as ViewMode
        const query: RecordsRequestParams = {
          order: (route.query.order as string) || 'DESC',
          orderBy: (route.query.orderBy as string) || 'created_at',
          page: Number(route.query.page) || 1,
          perPage: Number(route.query.perPage) || 50,
          show: viewMode || null,
        }

        this.pending = true

        const recordsData = await $fetch<RecordsResponse>('/api/data/records', {
          method: 'GET',
          headers: { cookie: getCookie() },
          query,
        })

        this.records = recordsData.data || []
        this.totalPages = recordsData.last_page || 0
        this.pending = false
      } catch (error: any) {
        handleAuthError(error)
      }
    },

    async fetchBalance() {
      try {
        const balance = await $fetch<number>('/api/data/total', { method: 'GET', headers: { cookie: getCookie() } })
        this.balance = balance ?? 0
      } catch (error: any) {
        handleAuthError(error)
      }
    },

    async fetchCategories() {
      try {
        const categories = await $fetch<RecordsCategory[]>('/api/data/categories', {
          method: 'GET',
          headers: { cookie: getCookie() },
        })
        this.categories = categories || []
      } catch (error: any) {
        handleAuthError(error)
      }
    },

    async fetchFirstRecord() {
      try {
        const firstRecord = await $fetch<RecordsItem>('/api/data/records/first', {
          method: 'GET',
          headers: { cookie: getCookie() },
        })
        this.firstRecord = firstRecord || {}
      } catch (error: any) {
        handleAuthError(error)
      }
    },

    async fetchMonthRecords() {
      try {
        const date = new Date()
        const y = date.getFullYear()
        const m = date.getMonth() + 1
        const monthRecords = await $fetch<{ [key: string]: RecordsItem[] }>(`/api/data/month/${y}-${m}`, {
          method: 'GET',
          headers: { cookie: getCookie() },
        })
        this.monthRecords = monthRecords || {}
      } catch (error: any) {
        handleAuthError(error)
      }
    },

    async fetchSnapshot() {
      try {
        const snapshot = await $fetch<RecordsSnapshot>('/api/data/revises/latest', {
          method: 'GET',
          headers: { cookie: getCookie() },
        })
        this.snapshot = snapshot || {}
      } catch (error: any) {
        handleAuthError(error)
      }
    },

    async fetchGlobalData() {
      try {
        await Promise.all([
          this.fetchBalance(),
          this.fetchCategories(),
          this.fetchFirstRecord(),
          this.fetchMonthRecords(),
          this.fetchSnapshot(),
        ])
      } catch (error: any) {
        handleAuthError(error)
      }
    },

    async refetchOnRecordsChange() {
      try {
        await Promise.all([this.fetchRecordsData(), this.fetchBalance(), this.fetchMonthRecords()])
      } catch (error: any) {
        handleAuthError(error)
      }
    },
  },
})

function getCookie() {
  const headers = useRequestHeaders(['cookie'])
  const cookie = headers.cookie as string
  return cookie
}
