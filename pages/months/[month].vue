<template>
  <PageContent :loading="recordsStore.loading" class="overflow-hidden" spinner-variant="primary">
    <template #header>
      <UiButton
        :aria-label="useString('home')"
        :title="useString('home')"
        class="btn-back d-lg-none"
        icon="arrow-left-24"
        icon-size="24"
        to="/"
        variant="link"
      />

      <h1 class="h4 card-title">{{ monthName }}</h1>

      <ChartButton v-model="collapseOpen" />
    </template>

    <UiCollapse v-model="collapseOpen">
      <MonthChart v-if="data" :data="data?.chartData" class="pb-12 pb-lg-0" />
    </UiCollapse>

    <GroupTable
      v-if="data"
      :group-label="useString('category')"
      :items="data.tableItems"
      :loading="recordsStore.loading"
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
import { useRecordsStore } from '~/store/records'

import CATEGORIES_WITH_RECORDS_QUERY from '~/graphql/CategoriesWithRecords.gql'

import type { SeriesObjectValue } from 'chartist'
import type { RecordsCategory, RecordsItem } from '~/types'
import type { TableItem } from '~/components/ui/ui-table.vue'

interface CategoriesWithRecordsQueryResponse {
  categories: {
    data: CategoryWithRecords[]
  }
}

interface CategoryWithRecords extends RecordsCategory {
  records: RecordsItem[]
  recordsTotal: number
}

const { $urql } = useNuxtApp()
const route = useRoute()
const recordsStore = useRecordsStore()

const collapseOpen = ref(false)

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
    recordsStore.firstRecordDate?.year >= monthDate.value.year &&
    recordsStore.firstRecordDate?.month >= monthDate.value.month
)
const isEnd = computed(
  () => DateTime.local().year <= monthDate.value.year && DateTime.local().month <= monthDate.value.month
)

/* Fetch current month records */

const { data } = await useAsyncData(async () => {
  const from = monthDate.value
  const to = from.plus({ month: 1 }).minus({ second: 1 })
  const where = {
    AND: [
      { column: 'CREATED_AT', operator: 'GTE', value: from.toFormat('yyyy-LL-dd HH:mm:ss') },
      { column: 'CREATED_AT', operator: 'LTE', value: to.toFormat('yyyy-LL-dd HH:mm:ss') },
    ],
  }

  /* Filter by month is the same for records & recordsTotal, but variable types
   * are different in GQL, so query variables have to be separate */

  const variables = { where, whereTotal: where }

  const { data: categoriesData } = await $urql
    .query<CategoriesWithRecordsQueryResponse>(CATEGORIES_WITH_RECORDS_QUERY, variables)
    .toPromise()

  const { chartData, tableItems } = buildTableItems(categoriesData?.categories)

  return { chartData, tableItems }
})

/* Transform categories with records into the table rows */

function buildTableItems(categories?: CategoriesWithRecordsQueryResponse['categories']) {
  const dataset: SeriesObjectValue<number>[] = []
  const labels: string[] = []
  const tableItems: TableItem[] = []

  let balance = 0
  let totalExpenses = 0

  categories?.data?.forEach(({ color, id, is_income, name, records, recordsTotal, slug }) => {
    if (is_income) {
      balance += recordsTotal
    } else {
      balance -= recordsTotal
      totalExpenses += recordsTotal

      if (recordsTotal) {
        dataset.push({ meta: { color, id, name }, value: recordsTotal })
        labels.push(name)
      }
    }

    if (recordsTotal) {
      tableItems.push({
        category: { color, id, is_income, name, slug },
        group: name,
        records: records.map((record) => ({ ...record, category: { color, id, is_income, name, slug } })),
        subtotal: recordsTotal,
        trClass: is_income ? 'row-income' : undefined,
      })
    }
  })

  /* Append table rows with total expenses & balance */

  tableItems.push(
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

  return {
    chartData: { labels, series: dataset },
    tableItems,
  }
}

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
.btn-chart {
  align-self: flex-start;
  margin-block: -$border-width;
  margin-left: auto;
  padding: 0.5rem;
}

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

@include media-min-width(lg) {
  .btn-chart {
    margin-block: calc(-#{$border-width} - 0.5rem);
  }
}
</style>
