<template>
  <PageContent :loading="pending" :title="monthName" spinner-variant="primary" class="overflow-hidden">
    <GroupTable :group-label="useString('category')" :items="tableItems" :loading="pending" />
  </PageContent>
</template>

<script setup lang="ts">
import { DateTime } from 'luxon'
import { useRecordsStore } from '~/store/records'

type MonthRecords = {
  [key: string]: RecordsItem[]
}

type MonthRecordsGroup = {
  category?: RecordsCategory
  group?: string
  subtotal: number
  trClass?: string
  records?: RecordsItem[]
}

const route = useRoute()
const recordsStore = useRecordsStore()

const month = route.params.month as string
const monthName = DateTime.fromFormat(month, 'yyyy-LL').toLocaleString(
  { month: 'long', year: 'numeric' },
  { locale: useLocale() }
)

const { data, pending } = await useAsyncData(`month/${month}`, async () => {
  const headers = useRequestHeaders(['cookie'])
  const cookie = headers.cookie as string

  const fetchOptions = { method: 'GET', headers: { cookie }, query: { month } }

  const response = await $fetch<MonthRecords>('/api/data/month/records', fetchOptions)

  const mappedResponse: MonthRecordsGroup[] = []
  let totalExpense = 0
  let totalIncome = 0

  Object.entries(response).forEach(([key, value]) => {
    const category = recordsStore.categories.find(({ id }) => `${id}` === key)
    const isIncome = category?.is_income || 0
    const group = category?.name
    const subtotal = value?.reduce((total, { sum }) => (total += sum), 0)
    const trClass = isIncome ? 'row-income' : undefined

    const index = Number(key) - 1 + Object.entries(response).length * isIncome

    mappedResponse[index] = { category, group, subtotal, trClass, records: value }
    totalExpense += isIncome ? 0 : subtotal
    totalIncome += isIncome ? subtotal : 0
  })

  const balance = totalIncome - totalExpense

  const rowBalance = {
    group: useString('monthBalance'),
    subtotal: balance,
    trClass: `row-balance ${balance > 0 ? 'row-balance-positive' : 'row-balance-negative'}`,
  }

  const tableItems = mappedResponse.filter((el) => Boolean(el))
  tableItems.push(rowBalance)

  return { tableItems }
})

const tableItems = computed(() => data?.value?.tableItems || [])
</script>

<style lang="scss" scoped>
:deep(.page-content-body) {
  padding: 0;
}

:deep(.table) {
  .row-income {
    color: var(--on-success-bg);
    background-color: var(--success-bg);

    .btn-details {
      &:not(:disabled):not(.disabled) {
        &:hover {
          color: var(--success-active);
        }
      }
    }

    &.details-visible {
      color: var(--on-success-bg-active);
      background-color: var(--success-bg-active);
    }
  }

  .row-balance {
    font-weight: $font-weight-medium;
    border-top: $border-width solid transparent;
    background-color: var(--background);
  }

  .row-balance-positive {
    color: var(--secondary);
    border-color: var(--secondary-outline);
  }

  .row-balance-negative {
    color: var(--danger);
    border-color: var(--danger-outline);
  }
}
</style>
