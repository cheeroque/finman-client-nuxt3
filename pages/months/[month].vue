<template>
  <PageContent :loading="recordsStore.loading" :title="monthName" class="overflow-hidden" spinner-variant="primary">
    <GroupTable
      v-if="data"
      :group-label="useString('category')"
      :items="data.tableItems"
      :loading="recordsStore.loading"
    />
  </PageContent>
</template>

<script setup lang="ts">
import { DateTime } from 'luxon'
import { useRecordsStore } from '~/store/records'

import CATEGORIES_WITH_RECORDS_QUERY from '~/graphql/CategoriesWithRecords.gql'

import type { RecordsCategory, RecordsItem } from '~/types/records'

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

const month = computed(() => String(route.params.month))

const monthName = computed(() =>
  DateTime.fromFormat(month.value, 'yyyy-LL').toLocaleString(
    { month: 'long', year: 'numeric' },
    { locale: useLocale() }
  )
)

const { data } = await useAsyncData(async () => {
  const from = DateTime.fromFormat(month.value, 'yyyy-LL')
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

  const { data: categoriesData } = await $urql.query<CategoriesWithRecordsQueryResponse>(
    CATEGORIES_WITH_RECORDS_QUERY,
    variables
  )

  const tableItems = buildTableItems(categoriesData?.categories)

  return { tableItems }
})

/* Transform categories with records into the table rows */

function buildTableItems(categories?: CategoriesWithRecordsQueryResponse['categories']) {
  const tableItems = []
  let balance = 0
  let totalExpenses = 0

  categories?.data?.forEach(({ color, id, is_income, name, records, recordsTotal, slug }) => {
    if (is_income) {
      balance += recordsTotal
    } else {
      balance -= recordsTotal
      totalExpenses += recordsTotal
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

  return tableItems
}
</script>

<style lang="scss" scoped>
:deep(.page-content-body) {
  padding: 0;
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
