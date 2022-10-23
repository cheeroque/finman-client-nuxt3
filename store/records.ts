import { defineStore } from 'pinia'
import { useApiFetch } from '@/composables/useApiFetch'

interface State {
  categories: RecordsCategory[]
  firstRecord: RecordsItem
}

export const useRecordsStore = defineStore({
  id: 'records',

  state: (): State => ({
    categories: [],
    firstRecord: null,
  }),

  actions: {
    async fetchCategories(): Promise<void> {
      const { data, error } = await useApiFetch<RecordsCategory>('categories')
      this.categories = data.value || error.value
    },

    async fetchFirstRecord(): Promise<void> {
      const { data, error } = await useApiFetch<RecordsCategory>('records/first')
      this.firstRecord = data.value || error.value
    },
  },
})
