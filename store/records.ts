import { defineStore } from 'pinia'

import type { RecordsCategory, RecordsSnapshot } from '~/types/records'

export const useRecordsStore = defineStore('records', () => {
  const balance = ref<number>(0)
  const categories = ref<RecordsCategory[]>([])
  const pending = ref<number>(0)
  const snapshot = ref<RecordsSnapshot>()

  const loading = computed(() => Boolean(pending.value))

  return {
    balance,
    categories,
    loading,
    pending,
    snapshot,
  }
})
