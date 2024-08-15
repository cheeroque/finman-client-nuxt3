import { DateTime } from 'luxon'
import { CategoriesTable, TransactionsTable } from '~/server/db/schema'
import type { InferSelectModel } from 'drizzle-orm'

type Category = InferSelectModel<typeof CategoriesTable>
type Transaction = InferSelectModel<typeof TransactionsTable>

export const useGlobalStore = defineStore('global', () => {
  const balance = ref(0)
  const categories = ref<Category[]>([])
  const firstTransaction = ref<Transaction | null>(null)
  const pending = ref(false)

  const startDate = computed(() => {
    let dateTime = DateTime.fromSQL(firstTransaction.value?.createdAt ?? '')

    if (!dateTime.isValid) {
      dateTime = DateTime.now()
    }

    const { month, year } = dateTime

    return { month, year }
  })

  return {
    balance,
    categories,
    firstTransaction,
    pending,
    startDate,
  }
})
