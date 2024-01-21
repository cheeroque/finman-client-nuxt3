import { DateTime } from 'luxon'
import { defineStore } from 'pinia'

import type { Category, Revise, Transaction } from '~/gen/gql/graphql'

interface TransactionsState {
  balance: number
  categories: Category[]
  firstTransaction?: Transaction
  pending: number
  revise?: Revise
}

export const useTransactionsStore = defineStore({
  id: 'transactions',

  state: (): TransactionsState => ({
    balance: 0,
    categories: [],
    firstTransaction: undefined,
    pending: 0,
    revise: undefined,
  }),

  getters: {
    loading: (state) => Boolean(state.pending),

    firstTransactionDate: (state) => {
      const dateTime = DateTime.fromFormat(state.firstTransaction?.created_at ?? '', 'yyyy-LL-dd HH:mm:ss')
      return dateTime.isValid ? dateTime : DateTime.now()
    },
  },
})
