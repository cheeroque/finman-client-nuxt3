import { DateTime } from 'luxon'
import { defineStore } from 'pinia'

import type { RecordsCategory, RecordsItem, RecordsSnapshot } from '~/types'

interface RecordsState {
  balance: number
  categories: RecordsCategory[]
  firstRecord?: RecordsItem
  pending: number
  snapshot?: RecordsSnapshot
}

export const useRecordsStore = defineStore({
  id: 'records',

  state: (): RecordsState => ({
    balance: 0,
    categories: [],
    firstRecord: undefined,
    pending: 0,
    snapshot: undefined,
  }),

  getters: {
    loading: (state) => Boolean(state.pending),

    firstRecordDate: (state) => {
      const dateTime = DateTime.fromFormat(state.firstRecord?.created_at ?? '', 'yyyy-LL-dd HH:mm:ss')
      return dateTime.isValid ? dateTime : DateTime.now()
    },
  },
})
