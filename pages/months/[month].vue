<template>
  <PageContent :loading="pending" :title="monthName" class="overflow-hidden" spinner-variant="primary">
    <GroupTable v-if="data" :group-label="useString('category')" :items="data.items" />

    <template #footer>
      <UiButton
        :disabled="isBeginning"
        :to="prevMonthLink"
        class="pagination-link"
        icon="chevron-double-left-24"
        icon-size="24"
      >
        <span class="d-md-none" v-text="formatMonthName(prevMonth, true)" />
        <span class="d-none d-md-inline" v-text="formatMonthName(prevMonth)" />
      </UiButton>

      <UiButton
        :disabled="isEnd"
        :to="nextMonthLink"
        class="pagination-link"
        icon="chevron-double-right-24"
        icon-size="24"
        icon-end
      >
        <span class="d-md-none" v-text="formatMonthName(nextMonth, true)" />
        <span class="d-none d-md-inline" v-text="formatMonthName(nextMonth)" />
      </UiButton>
    </template>
  </PageContent>
</template>

<script setup lang="ts">
import { DateTime } from 'luxon'
import type { TableItem } from '~/types'

const route = useRoute()
const globalStore = useGlobalStore()
const { startDate } = storeToRefs(globalStore)

const { data, error, status } = await useAsyncData(route.fullPath, async () => {
  const { totalExpenses, totalIncomes, transactions } = await useRequestFetch()(
    `/api/transactions/period/${route.params.month}`
  )

  const balance = totalIncomes - totalExpenses

  const items: TableItem[] = transactions.map((item) => ({
    ...item,
    trClass: item.isIncome ? 'row-income' : undefined,
  }))

  items.push(
    {
      group: useString('monthExpenses'),
      subtotal: totalExpenses,
      trClass: 'row-expense',
    },
    {
      group: useString('monthBalance'),
      subtotal: balance,
      trClass: `row-balance ${balance > 0 ? 'row-balance-positive' : 'row-balance-negative'}`,
    }
  )

  return { items }
})

if (error.value) {
  showError(error.value)
}

const pending = computed(() => status.value === 'pending')

const month = computed(() => String(route.params.month))
const monthDate = computed(() => DateTime.fromFormat(month.value, 'yyyy-LL'))
const monthName = computed(() => formatMonthName(monthDate.value))

/* Get previous / next month links and labels for footer buttons */

const prevMonth = computed(() => monthDate.value.minus({ month: 1 }))
const prevMonthLink = computed(() => (!isBeginning.value ? `/months/${formatMonthLink(prevMonth.value)}` : undefined))

const nextMonth = computed(() => monthDate.value.plus({ month: 1 }))
const nextMonthLink = computed(() => (!isEnd.value ? `/months/${formatMonthLink(nextMonth.value)}` : undefined))

/* Get beginning and end states to disable footer previous / next month buttons */

const isBeginning = computed(
  () =>
    !startDate.value ||
    (startDate.value?.year >= monthDate.value.year && startDate.value?.month >= monthDate.value.month)
)
const isEnd = computed(
  () => DateTime.local().year <= monthDate.value.year && DateTime.local().month <= monthDate.value.month
)

function formatMonthLink(dateTime: DateTime): string {
  return dateTime.toFormat('yyyy-LL')
}

function formatMonthName(dateTime: DateTime, short?: boolean): string {
  const format = short ? 'LL.yyyy' : 'LLLL yyyy'
  const name = dateTime.toFormat(format, { locale: useLocale() })

  return `${name[0].toUpperCase()}${name.slice(1)}`
}
</script>

<style lang="scss" scoped>
.pagination-link {
  border-radius: $control-border-radius;
}

:deep(.page-content-body) {
  padding: 0;
}

:deep(.page-content-footer) {
  display: flex;
  gap: 0 $grid-gap;
  justify-content: space-between;
}

:deep(.table) {
  .row-expense {
    color: var(--on-danger-bg);
    background-color: var(--danger-bg);
  }

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
