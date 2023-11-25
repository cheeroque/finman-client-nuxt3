import { defineStore } from 'pinia'

import type { RecordsCategory, RecordsSnapshot } from '~/types/records'

interface RecordsState {
  balance: number
  categories: RecordsCategory[]
  pending: number
  snapshot?: RecordsSnapshot
}

export const useRecordsStore = defineStore({
  id: 'records',

  state: (): RecordsState => ({
    balance: 0,
    categories: [],
    pending: 0,
    snapshot: undefined,
  }),

  getters: {
    loading: (state) => Boolean(state.pending),
  },
})
