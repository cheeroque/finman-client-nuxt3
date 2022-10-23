import { defineStore } from 'pinia'
import { useApiFetch } from '@/composables/useApiFetch'

interface State {
  categories: RecordsCategory[]
}

export const useRecordsStore = defineStore({
  id: 'records',

  state: (): State => ({
    categories: [],
  }),

  actions: {
    async fetchCategories(): Promise<void> {
      const { data, error } = await useApiFetch<RecordsCategory>('categories')
      this.categories = data.value || error.value
    },

    saveCategories(payload: RecordsCategory[]): void {
      this.categories = payload
    },
  },
})
