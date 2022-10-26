import { defineStore } from 'pinia'
import { useApiFetch } from '@/composables/useApiFetch'

interface State {
  categories: RecordsCategory[]
  currentMonthRecords: RecordsItem[]
  firstRecord: RecordsItem
  latestSnapshot: RecordsSnapshot
  records: RecordsResponse
  total: number
}

export const useRecordsStore = defineStore({
  id: 'records',

  state: (): State => ({
    categories: [],
    currentMonthRecords: [],
    firstRecord: null,
    latestSnapshot: null,
    records: null,
    total: 0,
  }),

  actions: {
    async fetchCategories(): Promise<void> {
      const { data } = await useApiFetch<RecordsCategory>('categories', getFetchKey('categories'))
      this.categories = data.value
    },

    async fetchCurrentMonthRecords(): Promise<void> {
      const date = new Date()
      const y = date.getFullYear()
      const m = date.getMonth() + 1
      const { data } = await useApiFetch<RecordsItem[]>(`month/${y}-${m}`, getFetchKey('currentMonthRecords'))
      this.currentMonthRecords = data.value
    },

    async fetchFirstRecord(): Promise<void> {
      const { data } = await useApiFetch<RecordsItem>('records/first', getFetchKey('firstRecord'))
      this.firstRecord = data.value
    },

    async fetchLatestSnapshot(): Promise<void> {
      const { data } = await useApiFetch<RecordsSnapshot>('revises/latest', getFetchKey('latestSnapshot'))
      this.latestSnapshot = data.value
    },

    async fetchRecords(params?: RecordsRequestParams): Promise<void> {
      const { data } = await useApiFetch<RecordsResponse>('records', {
        ...getFetchKey('records'),
        params,
      })
      this.records = data.value
    },

    async fetchTotal(): Promise<void> {
      const { data } = await useApiFetch<number>('total', getFetchKey('total'))
      this.total = data.value
    },

    async fetchGlobalData(): Promise<void> {
      await Promise.all([
        this.fetchCategories(),
        this.fetchCurrentMonthRecords(),
        this.fetchFirstRecord(),
        this.fetchLatestSnapshot(),
        this.fetchTotal(),
      ])
    },
  },
})

function getFetchKey(keystring) {
  return { key: `${keystring}-${Date.now()}` }
}
