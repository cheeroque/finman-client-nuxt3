<template>
  <PageContent :loading="pending" :title="monthName" class="overflow-hidden" spinner-variant="primary">
    <GroupTable
      v-if="tableItems"
      :group-label="useString('category')"
      :items="tableItems"
      :loading="transactionsStore.loading"
    />

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
        icon-right
      >
        <span class="d-md-none" v-text="formatMonthName(nextMonth, true)" />
        <span class="d-none d-md-inline" v-text="formatMonthName(nextMonth)" />
      </UiButton>
    </template>
  </PageContent>
</template>

<script setup lang="ts">
import { DateTime } from 'luxon'
import { useTransactionsStore } from '~/store/transactions'

const route = useRoute()
const transactionsStore = useTransactionsStore()

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
    transactionsStore.firstTransactionDate?.year >= monthDate.value.year &&
    transactionsStore.firstTransactionDate?.month >= monthDate.value.month
)
const isEnd = computed(
  () => DateTime.local().year <= monthDate.value.year && DateTime.local().month <= monthDate.value.month
)

/* Fetch current month transactions */

const query = computed(() => {
  const from = monthDate.value
  const to = from.plus({ month: 1 }).minus({ second: 1 })

  return {
    from: from.toFormat('yyyy-LL-dd HH:mm:ss'),
    to: to.toFormat('yyyy-LL-dd HH:mm:ss'),
  }
})

const { data, pending } = await useFetch('/api/month', { query })

const tableItems = computed(() => {
  const items = data.value?.tableItems ?? []

  return [
    ...items,
    {
      group: useString('monthExpenses'),
      subtotal: data.value?.totalExpenses ?? 0,
      trClass: 'row-expense',
    },
    {
      group: useString('monthBalance'),
      subtotal: data.value?.balance ?? 0,
      trClass: `row-balance ${Number(data.value?.balance) > 0 ? 'row-balance-positive' : 'row-balance-negative'}`,
    },
  ]
})

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
