import { defineStore } from 'pinia'

interface State {
  balance: number
  categories: RecordsCategory[] | []
  firstRecord: RecordsItem | {}
  monthRecords: { [key: string]: RecordsItem[] }
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
    snapshot: {},
    records: [],
    totalPages: 0,
  }),
})
