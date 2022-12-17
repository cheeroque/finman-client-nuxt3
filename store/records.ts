import { defineStore } from 'pinia'

interface State {
  balance: number
  categories: RecordsCategory[] | []
  firstRecord: RecordsItem | {}
  monthRecords: { [key: string]: RecordsItem[] }
  pending: boolean
  records: RecordsItem[] | []
  snapshot: RecordsSnapshot | {}
  totalPages: number
}

export const useRecordsStore = defineStore({
  id: 'records',

  state: (): State => ({
    balance: 0,
    categories: [],
    firstRecord: {},
    monthRecords: {},
    pending: false,
    snapshot: {},
    records: [],
    totalPages: 0,
  }),

  actions: {
    async fetchRecordsData() {
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
    },

    async fetchBalance() {
      console.log('fetch balance')
      const balance = await $fetch<number>('/api/data/total', { method: 'GET', headers: { cookie: getCookie() } })
      this.balance = balance ?? 0
    },

    async fetchCategories() {
      const categories = await $fetch<RecordsCategory[]>('/api/data/categories', {
        method: 'GET',
        headers: { cookie: getCookie() },
      })
      this.categories = categories || []
    },

    async fetchFirstRecord() {
      const firstRecord = await $fetch<RecordsItem>('/api/data/records/first', {
        method: 'GET',
        headers: { cookie: getCookie() },
      })
      this.firstRecord = firstRecord || {}
    },

    async fetchMonthRecords() {
      const date = new Date()
      const y = date.getFullYear()
      const m = date.getMonth() + 1
      const monthRecords = await $fetch<{ [key: string]: RecordsItem[] }>(`/api/data/month/${y}-${m}`, {
        method: 'GET',
        headers: { cookie: getCookie() },
      })
      this.monthRecords = monthRecords || {}
    },

    async fetchSnapshot() {
      const snapshot = await $fetch<RecordsSnapshot>('/api/data/revises/latest', {
        method: 'GET',
        headers: { cookie: getCookie() },
      })
      this.snapshot = snapshot || {}
    },

    async fetchGlobalData() {
      await Promise.all([
        this.fetchBalance(),
        this.fetchCategories(),
        this.fetchFirstRecord(),
        this.fetchMonthRecords(),
        this.fetchSnapshot(),
      ])
    },

    async refetchOnRecordsChange() {
      await Promise.all([this.fetchRecordsData(), this.fetchBalance(), this.fetchMonthRecords()])
    },
  },
})

function getCookie() {
  const headers = useRequestHeaders(['cookie'])
  const cookie = headers.cookie as string
  return cookie
}
